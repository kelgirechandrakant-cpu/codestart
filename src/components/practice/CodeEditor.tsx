import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, CheckCircle2, XCircle, Terminal, Cpu, Loader2 } from "lucide-react";
import { Language } from "@/types/coding";

interface CodeEditorProps {
  initialCode: string;
  language: Language;
  onRun: (code: string) => Promise<void>;
  onSubmit: (code: string) => Promise<void>;
  onReset: () => void;
  isRunning?: boolean;
  isSubmitting?: boolean;
  executionOutput?: {
    success?: boolean;
    output?: string;
    error?: string;
    testCaseResults?: { input: string; expected: string; actual: string; passed: boolean }[];
  } | null;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode,
  language,
  onRun,
  onSubmit,
  onReset,
  isRunning = false,
  isSubmitting = false,
  executionOutput = null
}) => {
  const [code, setCode] = useState(initialCode);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newCode = code.substring(0, start) + "    " + code.substring(end);
      setCode(newCode);

      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  const lines = code.split("\n");

  return (
    <div className="flex flex-col h-full bg-card text-foreground rounded-xl border border-border overflow-hidden shadow-sm">
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          <span className="ml-2 px-2.5 py-0.5 text-xs font-mono font-semibold bg-muted text-muted-foreground rounded-md border border-border">
            {language} Arena
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCode(initialCode);
              onReset();
            }}
            className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
            title="Reset code to original"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRun(code)}
            disabled={isRunning || isSubmitting}
            className="h-8 px-3.5 text-xs font-medium shadow-sm transition-all flex items-center gap-1.5"
          >
            {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            Run Test
          </Button>
          <Button
            size="sm"
            onClick={() => onSubmit(code)}
            disabled={isRunning || isSubmitting}
            className="h-8 px-4 text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
          >
            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            Submit Code
          </Button>
        </div>
      </div>

      {/* Code Area with Line Numbers */}
      <div className="flex-1 flex overflow-hidden relative font-mono text-sm leading-6 bg-background">
        <div className="w-12 py-4 bg-muted/30 text-muted-foreground select-none text-right pr-3 border-r border-border font-mono text-xs">
          {lines.map((_, index) => (
            <div key={index} className="h-6 leading-6">
              {index + 1}
            </div>
          ))}
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="flex-1 p-4 bg-transparent text-foreground resize-none outline-none overflow-auto font-mono text-sm leading-6 selection:bg-primary/20 placeholder:text-muted-foreground"
          placeholder="Write your solution here..."
        />
      </div>

      {/* Terminal / Execution Output Area */}
      <div className="border-t border-border bg-card max-h-60 overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2 text-xs font-mono font-medium text-muted-foreground">
            <Terminal className="w-3.5 h-3.5 text-primary" />
            Console Output
          </div>
          {executionOutput && (
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              {executionOutput.success ? (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Accepted
                </span>
              ) : (
                <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Check Logic
                </span>
              )}
            </div>
          )}
        </div>

        <div className="p-4 font-mono text-xs">
          {!executionOutput && !isRunning && !isSubmitting && (
            <div className="text-muted-foreground italic flex items-center gap-2">
              <Cpu className="w-4 h-4 text-muted-foreground" />
              Click "Run Test" or "Submit Code" to evaluate your logic...
            </div>
          )}

          {(isRunning || isSubmitting) && (
            <div className="text-primary flex items-center gap-2 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              Executing code against automated test suite...
            </div>
          )}

          {executionOutput && (
            <div className="space-y-3">
              {executionOutput.output && (
                <div className="p-2.5 rounded-lg bg-background border border-border text-foreground whitespace-pre-wrap">
                  {executionOutput.output}
                </div>
              )}

              {executionOutput.error && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 whitespace-pre-wrap flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{executionOutput.error}</span>
                </div>
              )}

              {executionOutput.testCaseResults && executionOutput.testCaseResults.length > 0 && (
                <div className="space-y-2 mt-2">
                  <div className="text-muted-foreground font-semibold mb-1">Test Cases:</div>
                  {executionOutput.testCaseResults.map((tc, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-md border flex flex-col gap-1 text-xs ${
                        tc.passed
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                          : "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span>Test Case #{idx + 1}</span>
                        <span>{tc.passed ? "PASSED ✅" : "FAILED ❌"}</span>
                      </div>
                      <div className="text-muted-foreground">Input: <code className="text-foreground">{tc.input}</code></div>
                      <div className="text-muted-foreground">Expected: <code className="text-emerald-600 dark:text-emerald-400">{tc.expected}</code></div>
                      {!tc.passed && (
                        <div className="text-muted-foreground">Actual Output: <code className="text-rose-600 dark:text-rose-400">{tc.actual}</code></div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
