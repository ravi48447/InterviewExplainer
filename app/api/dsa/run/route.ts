import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type RunRequest = { code: string; language: string; stdin?: string };
type RunResult = {
  status: string;
  statusId: number;
  stdout: string;
  stderr: string;
  compileOutput: string;
  time?: string;
  memory?: number;
};

const JUDGE0_LANGUAGE_IDS: Record<string, number> = {
  java: 62,
  python: 71,
  javascript: 63,
  cpp: 54,
};

const PISTON_LANGUAGES: Record<string, string> = {
  java: "java",
  python: "python",
  javascript: "javascript",
  cpp: "c++",
};

const MAX_CODE_LENGTH = 100_000;
const MAX_STDIN_LENGTH = 20_000;
const EXECUTION_TIMEOUT_MS = 20_000;

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function b64encode(value: string): string {
  return Buffer.from(value, "utf-8").toString("base64");
}

function b64decode(value?: string | null): string {
  if (!value) return "";
  return Buffer.from(value, "base64").toString("utf-8");
}

function runnerConfiguration():
  | { provider: "judge0"; url: string; headers: HeadersInit }
  | { provider: "piston"; url: string; headers: HeadersInit }
  | null {
  const requestedProvider = process.env.CODE_RUNNER_PROVIDER?.toLowerCase();
  const pistonUrl = process.env.PISTON_URL;
  const judge0Url = process.env.JUDGE0_URL;
  const rapidApiKey = process.env.RAPIDAPI_KEY;

  if (requestedProvider === "piston" || (!requestedProvider && pistonUrl)) {
    if (!pistonUrl) return null;
    const headers: Record<string, string> = {};
    if (process.env.PISTON_API_KEY) {
      headers.Authorization = `Bearer ${process.env.PISTON_API_KEY}`;
    }
    return {
      provider: "piston",
      url: stripTrailingSlash(pistonUrl),
      headers,
    };
  }

  if (requestedProvider === "judge0" || judge0Url) {
    if (!judge0Url) return null;
    const headers: Record<string, string> = {};
    if (process.env.JUDGE0_API_KEY) {
      headers["X-Auth-Token"] = process.env.JUDGE0_API_KEY;
    }
    return {
      provider: "judge0",
      url: stripTrailingSlash(judge0Url),
      headers,
    };
  }

  if (rapidApiKey) {
    const host = process.env.JUDGE0_HOST ?? "judge0-ce.p.rapidapi.com";
    return {
      provider: "judge0",
      url: `https://${host}`,
      headers: {
        "x-rapidapi-host": host,
        "x-rapidapi-key": rapidApiKey,
      },
    };
  }

  return null;
}

async function fetchWithTimeout(
  input: string,
  init: RequestInit,
): Promise<Response> {
  return fetch(input, {
    ...init,
    signal: AbortSignal.timeout(EXECUTION_TIMEOUT_MS),
    cache: "no-store",
  });
}

async function runWithJudge0(
  request: RunRequest,
  config: Extract<NonNullable<ReturnType<typeof runnerConfiguration>>, { provider: "judge0" }>,
): Promise<RunResult> {
  const languageId = JUDGE0_LANGUAGE_IDS[request.language];
  const commonHeaders = {
    "Content-Type": "application/json",
    ...config.headers,
  };
  const query = "base64_encoded=true&fields=status,stdout,stderr,compile_output,time,memory";
  const submission = await fetchWithTimeout(
    `${config.url}/submissions?base64_encoded=true&wait=false`,
    {
      method: "POST",
      headers: commonHeaders,
      body: JSON.stringify({
        source_code: b64encode(request.code),
        language_id: languageId,
        stdin: b64encode(request.stdin ?? ""),
      }),
    },
  );

  if (!submission.ok) {
    throw new Error(`Runner rejected the submission (${submission.status}).`);
  }

  const { token } = (await submission.json()) as { token?: string };
  if (!token) throw new Error("Runner did not return a submission token.");

  let result: {
    status?: { id?: number; description?: string };
    stdout?: string;
    stderr?: string;
    compile_output?: string;
    time?: string;
    memory?: number;
  } | null = null;

  for (let attempt = 0; attempt < 12; attempt += 1) {
    if (attempt > 0) {
      await new Promise((resolve) => setTimeout(resolve, 500 + attempt * 150));
    }
    const response = await fetchWithTimeout(`${config.url}/submissions/${token}?${query}`, {
      headers: config.headers,
    });
    if (!response.ok) {
      throw new Error(`Could not read the execution result (${response.status}).`);
    }
    result = await response.json();
    if ((result?.status?.id ?? 1) > 2) break;
  }

  if (!result || (result.status?.id ?? 1) <= 2) {
    throw new Error("Execution timed out while waiting for the runner.");
  }

  return {
    status: result.status?.description ?? "Finished",
    statusId: result.status?.id ?? 0,
    stdout: b64decode(result.stdout),
    stderr: b64decode(result.stderr),
    compileOutput: b64decode(result.compile_output),
    time: result.time,
    memory: result.memory,
  };
}

async function runWithPiston(
  request: RunRequest,
  config: Extract<NonNullable<ReturnType<typeof runnerConfiguration>>, { provider: "piston" }>,
): Promise<RunResult> {
  const fileName = (() => {
    if (request.language === "java") {
      const publicClass = request.code.match(/public\s+(?:final\s+)?class\s+([A-Za-z_$][\w$]*)/);
      return `${publicClass?.[1] ?? "Main"}.java`;
    }
    if (request.language === "python") return "main.py";
    if (request.language === "javascript") return "main.js";
    return "main.cpp";
  })();

  const response = await fetchWithTimeout(`${config.url}/api/v2/execute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...config.headers,
    },
    body: JSON.stringify({
      language: PISTON_LANGUAGES[request.language],
      version: "*",
      files: [{ name: fileName, content: request.code }],
      stdin: request.stdin ?? "",
      run_timeout: 10_000,
      compile_timeout: 10_000,
    }),
  });

  if (!response.ok) {
    throw new Error(`Runner rejected the submission (${response.status}).`);
  }

  const result = (await response.json()) as {
    compile?: { code: number | null; stdout?: string; stderr?: string; output?: string };
    run?: { code: number | null; stdout?: string; stderr?: string; output?: string };
  };
  const compileFailed = result.compile && result.compile.code !== 0;
  const runFailed = !compileFailed && result.run?.code !== 0;
  const statusId = compileFailed ? 6 : runFailed ? 11 : 3;

  return {
    status: compileFailed ? "Compilation Error" : runFailed ? "Runtime Error" : "Accepted",
    statusId,
    stdout: result.run?.stdout ?? "",
    stderr: result.run?.stderr ?? "",
    compileOutput: compileFailed
      ? result.compile?.output ?? result.compile?.stderr ?? result.compile?.stdout ?? ""
      : "",
  };
}

export async function POST(req: NextRequest) {
  let body: RunRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const language = body.language?.toLowerCase();
  if (!body.code?.trim() || !language) {
    return NextResponse.json({ error: "Code and language are required." }, { status: 400 });
  }
  if (!JUDGE0_LANGUAGE_IDS[language] || !PISTON_LANGUAGES[language]) {
    return NextResponse.json({ error: `Unsupported language: ${body.language}` }, { status: 400 });
  }
  if (body.code.length > MAX_CODE_LENGTH || (body.stdin?.length ?? 0) > MAX_STDIN_LENGTH) {
    return NextResponse.json({ error: "Code or input is too large to run safely." }, { status: 413 });
  }

  const config = runnerConfiguration();
  if (!config) {
    return NextResponse.json(
      {
        error:
          "The code runner is not configured. Set JUDGE0_URL, PISTON_URL, or RAPIDAPI_KEY on the server.",
      },
      { status: 503 },
    );
  }

  try {
    const normalizedRequest = { ...body, language };
    const result = config.provider === "judge0"
      ? await runWithJudge0(normalizedRequest, config)
      : await runWithPiston(normalizedRequest, config);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "The code runner failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
