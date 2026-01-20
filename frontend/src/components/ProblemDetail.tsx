import { useEffect, useState } from "react";
import axios from "axios";

import CodeEditor from "./CodeEditor";
import LanguageSelector from "./LanguageSelector";
import OutputBox from "./OutputBox";
import { Language } from "../types/language";

/* =========================
   Types
   ========================= */
interface Example {
  input: string;
  output: string;
  explanation: string;
}

interface Problem {
  id: number;
  title: string;
  description: string;
  constraints: string;
  examples: Example[];
}

interface Props {
  problemId: number;
  onBack: () => void;
}

export default function ProblemDetail({ problemId, onBack }: Props) {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [language, setLanguage] = useState<Language>("cpp");
  const [code, setCode] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  /* =========================
     Fetch problem
     ========================= */
  useEffect(() => {
    setProblem(null);
    setResult(null);

    axios
      .get(`http://localhost:5000/api/problems/${problemId}`)
      .then((res) => setProblem(res.data));
  }, [problemId]);

  /* =========================
     Submit code
     ========================= */
  const submitCode = async () => {
    try {
      setLoading(true);
      setResult(null);

      const res = await axios.post(
        "http://localhost:5000/api/judge/submit",
        {
          problemId,
          language,
          code,
        }
      );

      setResult(res.data);
    } finally {
      setLoading(false);
    }
  };

  if (!problem) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        className="mb-4 text-indigo-400 hover:underline"
      >
        ← Back
      </button>

      {/* Title */}
      <h1 className="text-2xl font-bold">{problem.title}</h1>

      {/* Description */}
      <p className="mt-3 whitespace-pre-line text-slate-300">
        {problem.description}
      </p>

      {/* Examples */}
      <h3 className="mt-6 font-semibold">Examples</h3>
      {problem.examples.map((ex, idx) => (
        <div
          key={idx}
          className="bg-[#1a1a1a] p-4 mt-3 rounded text-sm"
        >
          <p>
            <b>Input:</b> {ex.input}
          </p>
          <p className="mt-1">
            <b>Output:</b> {ex.output}
          </p>
          <p className="mt-1 text-slate-400">
            <b>Explanation:</b> {ex.explanation}
          </p>
        </div>
      ))}

      {/* Constraints */}
      <h3 className="mt-6 font-semibold">Constraints</h3>
      <p className="whitespace-pre-line text-slate-400">
        {problem.constraints}
      </p>

      {/* Editor */}
      <div className="mt-8">
        <LanguageSelector
          language={language}
          setLanguage={setLanguage}
        />

        <div className="mt-3">
          <CodeEditor
            language={language}
            code={code}
            setCode={setCode}
          />
        </div>

        <button
          type="button"
          onClick={submitCode}
          disabled={loading}
          className="mt-4 px-5 py-2 bg-emerald-600 text-white rounded disabled:opacity-40"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

        <div className="mt-4">
          <OutputBox
            result={result}
            loading={loading}
            onClear={() => setResult(null)}
          />
        </div>
      </div>
    </div>
  );
}
