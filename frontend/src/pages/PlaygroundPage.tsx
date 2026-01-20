import { useState } from "react";
import axios from "axios";
import {
  PlayIcon,
  CommandLineIcon,
} from "@heroicons/react/24/outline";

import CodeEditor from "../components/CodeEditor";
import LanguageSelector from "../components/LanguageSelector";
import OutputBox from "../components/OutputBox";
import InputBox from "../components/InputBox";
import { Language } from "../types/language";

/**
 * Raw Judge0 run response
 */
interface ExecutionResponse {
  stdout?: string;
  stderr?: string;
  compile_output?: string;
}

export default function PlaygroundPage() {
  const [code, setCode] = useState<string>("# Write your code here...");
  const [language, setLanguage] = useState<Language>("python");
  const [userInput, setUserInput] = useState<string>("");

  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  /* =========================
     RUN CODE (Playground)
     ========================= */
  const runCode = async (): Promise<void> => {
    try {
      setLoading(true);
      setResult(null);

      const res = await axios.post<ExecutionResponse>(
        "http://localhost:5000/api/judge/run",
        {
          code,
          language,
          input: userInput,
        }
      );

      // Normalize Judge0 response for OutputBox
      if (res.data.compile_output) {
        setResult({
          verdict: "Compile Error",
          error: res.data.compile_output,
        });
      } else if (res.data.stderr) {
        setResult({
          verdict: "Runtime Error",
          error: res.data.stderr,
        });
      } else {
        setResult({
          verdict: "Output",
          output: res.data.stdout || "No output",
        });
      }
    } catch (err) {
      setResult({
        verdict: "Error",
        error: "❌ Could not connect to execution server.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Playground</h1>

        <div className="flex items-center gap-4">
          <LanguageSelector
            language={language}
            setLanguage={setLanguage}
          />

          <button
            onClick={runCode}
            disabled={loading}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold transition-all ${
              loading
                ? "bg-slate-700 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-500 text-white"
            }`}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <PlayIcon className="w-4 h-4" />
            )}
            {loading ? "Running..." : "Run"}
          </button>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor */}
        <div className="lg:col-span-2">
          <CodeEditor
            code={code}
            setCode={setCode}
            language={language}
          />
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          <InputBox input={userInput} setInput={setUserInput} />

          <div className="flex flex-col flex-grow min-h-[250px]">
            <div className="flex items-center gap-2 mb-2 text-slate-400">
              <CommandLineIcon className="w-5 h-5" />
              <span className="text-sm uppercase tracking-widest">
                Output
              </span>
            </div>

            <OutputBox
              result={result}
              loading={loading}
              onClear={() => setResult(null)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
