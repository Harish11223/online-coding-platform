import { useState } from "react";
import axios from "axios";
import {
  PlayIcon,
  CommandLineIcon,
  CloudIcon,
} from "@heroicons/react/24/outline";

import CodeEditor from "./components/CodeEditor";
import LanguageSelector from "./components/LanguageSelector";
import OutputBox from "./components/OutputBox";
import InputBox from "./components/InputBox";

/**
 * Expected response from backend / Judge0 proxy
 */
interface ExecutionResponse {
  stdout?: string;
  stderr?: string;
  compile_output?: string;
}

type Language = "cpp" | "java" | "python" | "javascript";

function App() {
  const [code, setCode] = useState<string>("# Write your code here...");
  const [language, setLanguage] = useState<Language>("python");
  const [userInput, setUserInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const runCode = async (): Promise<void> => {
    try {
      setLoading(true);
      setOutput("Compiling and executing...");

      const res = await axios.post<ExecutionResponse>(
        "http://localhost:5000/api/run",
        {
          code,
          language,
          input: userInput,
        }
      );

      const result =
        res.data.stdout ||
        res.data.stderr ||
        res.data.compile_output ||
        "Execution finished with no output.";

      setOutput(result);
    } catch (error: unknown) {
      setOutput("❌ Error: Could not connect to the execution server.");
    } finally {
      setLoading(false);
    }
  };

  const clearOutput = (): void => {
    setOutput("");
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-slate-200 font-sans p-4 md:p-8">
      {/* Header Section */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <CloudIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              CodeCloud <span className="text-indigo-500">IDE</span>
            </h1>
          </div>
          <p className="text-slate-500 text-sm">
            Deploying to Judge0 @ AWS EC2
          </p>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSelector
            language={language}
            setLanguage={setLanguage}
          />

          <button
            onClick={runCode}
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all shadow-lg active:scale-95 ${loading
              ? "bg-slate-700 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20"
              }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <PlayIcon className="w-5 h-5" />
            )}
            {loading ? "Running..." : "Run Code"}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mt-20">
        {/* Editor Column */}
        <div className="lg:col-span-2">
          <CodeEditor
            code={code}
            setCode={setCode}
            language={language}
          />
        </div>

        {/* Sidebar */}
        <div className="flex flex-col h-full gap-6">
          <InputBox input={userInput} setInput={setUserInput} />

          <div className="flex flex-col flex-grow min-h-[300px]">
            <div className="flex items-center gap-2 mb-3 text-slate-400">
              <CommandLineIcon className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-widest">
                Console Output
              </h3>
            </div>

            <OutputBox
              output={output}
              loading={loading}
              onClear={clearOutput}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
