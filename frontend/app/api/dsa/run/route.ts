import { NextRequest, NextResponse } from "next/server";

// Judge0 CE language IDs
const LANG_IDS: Record<string, number> = {
  java: 62,
  python: 71,
  javascript: 63,
  cpp: 54,
};

const JUDGE0_HOST =
  process.env.JUDGE0_HOST ?? "judge0-ce.p.rapidapi.com";
const JUDGE0_API_KEY = process.env.RAPIDAPI_KEY ?? "";

function b64encode(str: string): string {
  return Buffer.from(str, "utf-8").toString("base64");
}

function b64decode(str: string): string {
  return Buffer.from(str, "base64").toString("utf-8");
}

async function poll(token: string, attempt = 0): Promise<Response> {
  if (attempt > 10)
    throw new Error("Execution timed out after too many retries.");

  const res = await fetch(
    `https://${JUDGE0_HOST}/submissions/${token}?base64_encoded=true&fields=status,stdout,stderr,compile_output,time,memory`,
    {
      headers: {
        "x-rapidapi-host": JUDGE0_HOST,
        "x-rapidapi-key": JUDGE0_API_KEY,
      },
    },
  );
  if (!res.ok) throw new Error(`Judge0 status fetch failed: ${res.status}`);
  const data = await res.json();

  // status.id: 1 = In Queue, 2 = Processing, 3+ = done
  if (data.status?.id <= 2) {
    await new Promise((r) => setTimeout(r, 800 + attempt * 200));
    return poll(token, attempt + 1);
  }
  return res;
}

export async function POST(req: NextRequest) {
  if (!JUDGE0_API_KEY) {
    return NextResponse.json(
      {
        error:
          "Code execution is not configured yet. Set RAPIDAPI_KEY in your environment to enable running code.",
      },
      { status: 503 },
    );
  }

  let body: { code: string; language: string; stdin?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { code, language, stdin = "" } = body;

  if (!code || !language) {
    return NextResponse.json(
      { error: "code and language are required" },
      { status: 400 },
    );
  }

  const langId = LANG_IDS[language.toLowerCase()];
  if (!langId) {
    return NextResponse.json(
      { error: `Unsupported language: ${language}` },
      { status: 400 },
    );
  }

  try {
    // Submit
    const submitRes = await fetch(
      `https://${JUDGE0_HOST}/submissions?base64_encoded=true&wait=false`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-host": JUDGE0_HOST,
          "x-rapidapi-key": JUDGE0_API_KEY,
        },
        body: JSON.stringify({
          source_code: b64encode(code),
          language_id: langId,
          stdin: b64encode(stdin),
        }),
      },
    );

    if (!submitRes.ok) {
      const text = await submitRes.text();
      return NextResponse.json(
        { error: `Submission failed: ${text}` },
        { status: 502 },
      );
    }

    const { token } = await submitRes.json();

    // Poll for result
    await new Promise((r) => setTimeout(r, 1000));
    const resultRes = await fetch(
      `https://${JUDGE0_HOST}/submissions/${token}?base64_encoded=true&fields=status,stdout,stderr,compile_output,time,memory`,
      {
        headers: {
          "x-rapidapi-host": JUDGE0_HOST,
          "x-rapidapi-key": JUDGE0_API_KEY,
        },
      },
    );

    if (!resultRes.ok) {
      throw new Error(`Result fetch failed: ${resultRes.status}`);
    }

    const result = await resultRes.json();

    // If still processing, poll again
    let finalResult = result;
    if (result.status?.id <= 2) {
      const polledRes = await poll(token, 0);
      finalResult = await polledRes.json();
    }

    return NextResponse.json({
      status: finalResult.status?.description ?? "Unknown",
      statusId: finalResult.status?.id ?? 0,
      stdout: finalResult.stdout ? b64decode(finalResult.stdout) : "",
      stderr: finalResult.stderr ? b64decode(finalResult.stderr) : "",
      compileOutput: finalResult.compile_output
        ? b64decode(finalResult.compile_output)
        : "",
      time: finalResult.time,
      memory: finalResult.memory,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
