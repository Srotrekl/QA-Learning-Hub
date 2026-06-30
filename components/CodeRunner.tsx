"use client";

import { useState, useRef } from "react";
import type { CodeExample } from "@/lib/types";

// Sandpack — lazy import to avoid SSR issues
import dynamic from "next/dynamic";

const SandpackProvider = dynamic(
  () => import("@codesandbox/sandpack-react").then((m) => m.SandpackProvider),
  { ssr: false },
);
const SandpackCodeEditor = dynamic(
  () => import("@codesandbox/sandpack-react").then((m) => m.SandpackCodeEditor),
  { ssr: false },
);
const SandpackConsole = dynamic(
  () => import("@codesandbox/sandpack-react").then((m) => m.SandpackConsole),
  { ssr: false },
);
const SandpackPreview = dynamic(
  () => import("@codesandbox/sandpack-react").then((m) => m.SandpackPreview),
  { ssr: false },
);

// ─── Sandpack theme matching our dark design tokens ───────────────────────────
const qaDarkTheme = {
  colors: {
    surface1: "#161b22",
    surface2: "#21262d",
    surface3: "#30363d",
    clickable: "#8b949e",
    base: "#e6edf3",
    disabled: "#6e7681",
    hover: "#e6edf3",
    accent: "#00d4aa",
    error: "#f85149",
    errorSurface: "#3d1a1a",
  },
  syntax: {
    plain: "#e6edf3",
    comment: { color: "#6e7681", fontStyle: "italic" as const },
    keyword: "#ff7b72",
    tag: "#7ee787",
    punctuation: "#8b949e",
    definition: "#d2a8ff",
    property: "#79c0ff",
    static: "#ffa657",
    string: "#a5d6ff",
  },
  font: {
    body: "var(--font-geist-sans), system-ui, sans-serif",
    mono: "var(--font-geist-mono), 'JetBrains Mono', monospace",
    size: "13px",
    lineHeight: "1.6",
  },
};

// ─── Sandpack runner (JS/TS) ──────────────────────────────────────────────────
function SandpackRunner({ example }: { example: CodeExample }) {
  const isTS = example.language === "ts";
  const fileName = isTS ? "index.ts" : "index.js";

  return (
    <SandpackProvider
      template={isTS ? "vanilla-ts" : "vanilla"}
      files={{ [`/src/${fileName}`]: example.code }}
      options={{ activeFile: `/src/${fileName}` }}
      theme={qaDarkTheme}
    >
      <div className="overflow-hidden rounded-md border border-[var(--color-border)]">
        <SandpackCodeEditor showLineNumbers showTabs={false} />
        <div className="border-t border-[var(--color-border)]">
          <SandpackConsole />
        </div>
      </div>
    </SandpackProvider>
  );
}

// ─── Python / YAML / Bash: read-only with simulated terminal output ───────────
function StaticRunner({ example }: { example: CodeExample }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(example.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const simulatedOutput: Record<string, string> = {
    python: `$ pytest tests/ -v
=================== test session starts ====================
collected 3 items

tests/test_example.py::test_create_booking PASSED   [ 33%]
tests/test_example.py::test_get_booking    PASSED   [ 67%]
tests/test_example.py::test_delete_booking PASSED   [100%]

==================== 3 passed in 0.42s =====================`,
    bash: `$ # Run the command above in your terminal`,
    yaml: `# This is a GitHub Actions workflow — paste into .github/workflows/ci.yml`,
  };

  const output = simulatedOutput[example.language] ?? `# ${example.language} — run locally`;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-bg-surface)]">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-2">
          <span className="font-mono text-xs text-[var(--color-text-muted)]">{example.language}</span>
          <button
            onClick={copy}
            aria-label="Copy code"
            className="font-mono text-xs text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            {copied ? "✓ copied" : "copy"}
          </button>
        </div>
        <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-[var(--color-text-primary)]">
          <code>{example.code}</code>
        </pre>
      </div>

      <div className="rounded-md border border-[var(--color-border)] bg-[#0d1117] p-4">
        <p className="mb-2 font-mono text-[10px] text-[var(--color-text-muted)]">
          $ simulated output
        </p>
        <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-[var(--color-pass)]">
          {output}
        </pre>
      </div>

      <p className="text-xs text-[var(--color-text-muted)]">
        Python/YAML/Bash examples run locally — browser execution not supported for this language.
      </p>
    </div>
  );
}

// ─── Pyodide runner (Python, lazy-loaded) ─────────────────────────────────────
type PyodideInstance = {
  runPythonAsync: (code: string) => Promise<unknown>;
  loadPackagesFromImports: (code: string) => Promise<void>;
};

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideInstance>;
    _pyodide?: PyodideInstance;
  }
}

function PyodideRunner({ example }: { example: CodeExample }) {
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "running" | "error">("idle");
  const [output, setOutput] = useState<string>("");
  const pyodideRef = useRef<PyodideInstance | null>(null);

  async function loadAndRun() {
    if (status === "loading" || status === "running") return;

    // Load Pyodide from CDN once
    if (!pyodideRef.current) {
      setStatus("loading");
      setOutput("");
      try {
        if (!window._pyodide) {
          // inject script tag lazily
          await new Promise<void>((resolve, reject) => {
            if (document.querySelector('script[src*="pyodide"]')) {
              resolve();
              return;
            }
            const s = document.createElement("script");
            s.src = "https://cdn.jsdelivr.net/pyodide/v0.27.6/full/pyodide.js";
            s.onload = () => resolve();
            s.onerror = () => reject(new Error("Failed to load Pyodide script"));
            document.head.appendChild(s);
          });
          window._pyodide = await window.loadPyodide!({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.6/full/",
          });
        }
        pyodideRef.current = window._pyodide!;
        setStatus("ready");
      } catch {
        setStatus("error");
        setOutput("Failed to load Python runtime. Check your internet connection.");
        return;
      }
    }

    setStatus("running");
    const py = pyodideRef.current;
    const lines: string[] = [];

    try {
      // Redirect stdout
      py.runPythonAsync(`
import sys, io
_buf = io.StringIO()
sys.stdout = _buf
`);
      await py.loadPackagesFromImports(example.code);
      await py.runPythonAsync(example.code);
      const out = await py.runPythonAsync("_buf.getvalue()");
      lines.push(String(out));
    } catch (err) {
      lines.push(String(err));
      setStatus("error");
      setOutput(lines.join("\n"));
      return;
    }

    setStatus("ready");
    setOutput(lines.join("\n") || "(no output)");
  }

  const canRun = example.language === "python" && !example.code.includes("pytest");

  if (!canRun) {
    return <StaticRunner example={example} />;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-bg-surface)]">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-2">
          <span className="font-mono text-xs text-[var(--color-text-muted)]">python</span>
          <span className="font-mono text-xs text-[var(--color-text-muted)]">
            powered by Pyodide
          </span>
        </div>
        <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-[var(--color-text-primary)]">
          <code>{example.code}</code>
        </pre>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={loadAndRun}
          disabled={status === "loading" || status === "running"}
          className="rounded-md bg-[var(--color-accent)] px-4 py-2 font-mono text-sm font-semibold text-[#0d1117] transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
        >
          {status === "loading"
            ? "Loading Python…"
            : status === "running"
              ? "Running…"
              : "▶ Run"}
        </button>
        {status === "loading" && (
          <span className="font-mono text-xs text-[var(--color-text-muted)]">
            ~5 s first load (downloads Python runtime)
          </span>
        )}
      </div>

      {output && (
        <div
          className={`rounded-md border p-4 ${
            status === "error"
              ? "border-[var(--color-fail)] bg-[var(--color-fail)]/5"
              : "border-[var(--color-border)] bg-[#0d1117]"
          }`}
        >
          <p className="mb-2 font-mono text-[10px] text-[var(--color-text-muted)]">output</p>
          <pre
            className={`overflow-x-auto font-mono text-xs leading-relaxed ${
              status === "error" ? "text-[var(--color-fail)]" : "text-[var(--color-pass)]"
            }`}
          >
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}

// ─── Public export ─────────────────────────────────────────────────────────────
export function CodeRunner({ example }: { example: CodeExample }) {
  if (example.language === "ts") {
    return <SandpackRunner example={example} />;
  }

  if (example.language === "python") {
    return <PyodideRunner example={example} />;
  }

  // bash / yaml / non-runnable: static view
  return <StaticRunner example={example} />;
}
