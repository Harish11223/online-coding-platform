import { useEffect, useState } from "react";
import axios from "axios";
import {
  PlayIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";

import CodeEditor from "../components/CodeEditor";
import LanguageSelector from "../components/LanguageSelector";
import OutputBox from "../components/OutputBox";
import InputBox from "../components/InputBox";

import { Language } from "../types/language";
import { TestCase } from "../types/problem";

/* =========================
   Judge Result Type
   ========================= */
interface JudgeResult {
  status: string;
  runtime: string;
  cases: {
    input: any;
    output: string;
    expected: string;
    passed: boolean;
  }[];
}

export default function PlaygroundPage() {
  /* =========================
     Editor & Language
     ========================= */
  const [code, setCode] = useState("# Write your code here...");
  const [language, setLanguage] = useState<Language>("python");
  const [userInput, setUserInput] = useState("");

  /* =========================
     Testcases & Results
     ========================= */
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [results, setResults] = useState<JudgeResult | null>(null);
  const [loading, setLoading] = useState(false);

  const problemId = 1; // TODO: make dynamic later

  /* =========================
     Fetch Test Cases (RUN MODE)
     ========================= */
  useEffect(() => {
    const fetchTestCases = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/problems/${problemId}/testcases?mode=run`
        );
        setTestCases(res.data.testCases);
      } catch {
        console.error("Failed to load test cases");
        setTestCases([]);
      }
    };

    fetchTestCases();
  }, [problemId]);

  /* =========================
     RUN
     ========================= */
  const runCode = async () => {
    try {
      setLoading(true);
      setResults(null);

      const res = await axios.post(
        "http://localhost:5000/api/judge/run",
        { problemId, code, language, input: userInput }
      );

      // 🔥 STORE FULL JUDGE RESPONSE
      setResults(res.data);
    } catch (e) {
      console.error("RUN ERROR 👉", e);

      setResults({
        status: "Runtime Error",
        runtime: "—",
        cases: [
          {
            input: userInput,
            output: "",
            expected: "",
            passed: false,
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SUBMIT
     ========================= */
  const submitCode = async () => {
    try {
      setLoading(true);
      setResults(null);

      const res = await axios.post(
        "http://localhost:5000/api/judge/submit",
        { problemId, code, language, input: userInput }
      );

      // 🔥 STORE FULL JUDGE RESPONSE
      setResults(res.data);
    } catch (e) {
      console.error("SUBMIT ERROR 👉", e);

      setResults({
        status: "Runtime Error",
        runtime: "—",
        cases: [
          {
            input: userInput,
            output: "",
            expected: "",
            passed: false,
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* =========================
          Navbar
         ========================= */}
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
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"
          >
            <PlayIcon className="w-4 h-4" />
            Run
          </button>

          <button
            onClick={submitCode}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50"
          >
            <CloudArrowUpIcon className="w-4 h-4" />
            Submit
          </button>
        </div>
      </div>

      {/* =========================
          Layout
         ========================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Code Editor */}
        <div className="lg:col-span-2">
          <CodeEditor
            code={code}
            setCode={setCode}
            language={language}
            setLanguage={setLanguage}
          />
        </div>

        {/* Right Panel */}
        <div className="flex flex-col gap-6">
          <InputBox
            input={userInput}
            setInput={setUserInput}
          />

          <div className="flex flex-col flex-grow min-h-[320px]">
            <OutputBox
              loading={loading}
              testCases={testCases}
              results={results}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
