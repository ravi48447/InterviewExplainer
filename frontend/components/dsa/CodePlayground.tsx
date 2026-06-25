"use client";

import { useCallback, useRef, useState } from "react";
import { Play, RotateCcw, Terminal, Clock, Cpu, AlertCircle, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useDSALang } from "@/components/dsa/DSALangContext";
import dynamic from "next/dynamic";

// Lazy-load Monaco to keep initial bundle small
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[360px] bg-[#1e1e1e]">
      <Loader2 className="h-5 w-5 text-slate-400 animate-spin" />
    </div>
  ),
});

const MONACO_LANG: Record<string, string> = {
  java: "java",
  python: "python",
  javascript: "javascript",
  cpp: "cpp",
};

const LANG_DISPLAY: Record<string, string> = {
  java: "Java",
  python: "Python",
  javascript: "JavaScript",
  cpp: "C++",
};

type RunResult = {
  status: string;
  statusId: number;
  stdout: string;
  stderr: string;
  compileOutput: string;
  time?: string;
  memory?: number;
  error?: string;
};

type Props = {
  /** Starter code per language from the problem JSON */
  starterCode: Record<string, string>;
  /** Default stdin to pre-fill (e.g. the first example's input) */
  defaultStdin?: string;
};

// Status IDs from Judge0: 3 = Accepted, 4 = Wrong Answer, 5 = TLE, 6 = Compile Error, 11 = Runtime Error
function statusMeta(statusId: number): { color: string; icon: React.ReactNode } {
  if (statusId === 3)
    return {
      color: "text-emerald-400",
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
    };
  if (statusId === 6)
    return {
      color: "text-amber-400",
      icon: <AlertCircle className="h-4 w-4 text-amber-400" />,
    };
  return {
    color: "text-rose-400",
    icon: <XCircle className="h-4 w-4 text-rose-400" />,
  };
}

export function CodePlayground({ starterCode, defaultStdin = "" }: Props) {
  const ctx = useDSALang();
  const activeLang = ctx?.lang ?? "java";

  const [code, setCode] = useState<Record<string, string>>({ ...starterCode });
  const [stdin, setStdin] = useState(defaultStdin);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [showStdin, setShowStdin] = useState(false);
  const runningRef = useRef(false);

  const currentCode = code[activeLang] ?? starterCode[activeLang] ?? "";

  const handleCodeChange = useCallback(
    (val: string | undefined) => {
      setCode((prev) => ({ ...prev, [activeLang]: val ?? "" }));
    },
    [activeLang],
  );

  const handleReset = useCallback(() => {
    setCode((prev) => ({
      ...prev,
      [activeLang]: starterCode[activeLang] ?? "",
    }));
    setResult(null);
  }, [activeLang, starterCode]);

  const handleRun = useCallback(async () => {
    if (runningRef.current) return;
    runningRef.current = true;
    setRunning(true);
    setResult(null);

    try {
      const res = await fetch("/api/dsa/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: currentCode,
          language: activeLang,
          stdin,
        }),
      });
      const data: RunResult = await res.json();
      setResult(data);
    } catch (err) {
      setResult({
        status: "Error",
        statusId: 0,
        stdout: "",
        stderr: "",
        compileOutput: "",
        error: err instanceof Error ? err.message : "Network error",
      });
    } finally {
      setRunning(false);
      runningRef.current = false;
    }
  }, [currentCode, activeLang, stdin]);

  const outputText =
    result?.error ??
    result?.compileOutput ??
    result?.stderr ??
    result?.stdout ??
    "";

  const meta = result?.statusId ? statusMeta(result.statusId) : null;

  return (
    <div className="rounded-xl overflow-hidden shadow-xl ring-1 ring-slate-950/5 border border-border">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-[#21252b] border-b border-[#181a1f] px-4 py-2">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-300">
            Try it — {LANG_DISPLAY[activeLang] ?? activeLang}
          </span>
          <span className="text-[10px] text-muted-foreground italic hidden sm:inline">
            · your code, your experiment
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowStdin((v) => !v)}
            className="text-[10.5px] font-semibold text-slate-400 hover:text-slate-200 transition-colors px-2 py-1 rounded hover:bg-slate-700"
          >
            {showStdin ? "Hide stdin" : "Custom input"}
          </button>
          <button
            onClick={handleReset}
            title="Reset to starter code"
            className="flex items-center gap-1 text-[10.5px] font-semibold text-slate-400 hover:text-slate-200 transition-colors px-2 py-1 rounded hover:bg-slate-700"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="bg-[#1e1e1e]">
        <MonacoEditor
          height="360px"
          language={MONACO_LANG[activeLang] ?? "plaintext"}
          value={currentCode}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{
            fontSize: 14,
            lineHeight: 22,
            fontFamily:
              'JetBrains Mono, ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 16, bottom: 16 },
            overviewRulerLanes: 0,
            renderLineHighlight: "line",
            lineNumbers: "on",
            glyphMargin: false,
            folding: true,
            wordWrap: "off",
            tabSize: activeLang === "python" ? 4 : 4,
            automaticLayout: true,
          }}
        />
      </div>

      {/* Custom stdin (collapsible) */}
      {showStdin && (
        <div className="bg-[#21252b] border-t border-[#181a1f] px-4 py-3">
          <label className="block text-[10.5px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
            stdin (custom input)
          </label>
          <textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            rows={3}
            className="w-full bg-[#1e1e1e] text-slate-200 font-mono text-[13px] rounded border border-slate-600 px-3 py-2 resize-y focus:outline-none focus:border-slate-400 placeholder:text-secondary"
            placeholder="Enter input for your program here..."
            spellCheck={false}
          />
        </div>
      )}

      {/* Run button + output */}
      <div className="bg-[#21252b] border-t border-[#181a1f]">
        <div className="px-4 py-2.5 flex items-center justify-between gap-3">
          <button
            onClick={handleRun}
            disabled={running}
            className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-primary-foreground dark:text-foreground font-bold text-[13px] transition-colors"
          >
            {running ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5 fill-current" />
            )}
            {running ? "Running…" : "Run Code"}
          </button>

          {result && !result.error && (
            <div className="flex items-center gap-3 text-[11.5px]">
              {meta && (
                <span className={`flex items-center gap-1 font-bold ${meta.color}`}>
                  {meta.icon}
                  {result.status}
                </span>
              )}
              {result.time && (
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="h-3 w-3" />
                  {result.time}s
                </span>
              )}
              {result.memory && (
                <span className="flex items-center gap-1 text-slate-400">
                  <Cpu className="h-3 w-3" />
                  {(result.memory / 1024).toFixed(0)} MB
                </span>
              )}
            </div>
          )}
        </div>

        {/* Output panel */}
        {(result || running) && (
          <div className="border-t border-[#181a1f] px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
              Output
            </p>
            {running ? (
              <div className="flex items-center gap-2 text-slate-400 text-[13px] font-mono">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Executing…
              </div>
            ) : (
              <pre className="text-[13px] font-mono text-slate-200 whitespace-pre-wrap break-words leading-[1.6] max-h-48 overflow-y-auto">
                {outputText || (
                  <span className="text-muted-foreground italic">No output.</span>
                )}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
