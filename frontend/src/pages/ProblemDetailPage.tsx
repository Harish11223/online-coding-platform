import {
  useParams,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import CodeEditor from "../components/CodeEditor";
import OutputBox from "../components/OutputBox";
import LanguageSelector from "../components/LanguageSelector";

import { Language } from "../types/language";
import { TestCase, TestResult } from "../types/problem";

/* =========================
   Layout Context Type
   ========================= */
interface LayoutContext {
  setOnRun: (fn?: () => void) => void;
  setOnSubmit: (fn?: () => void) => void;
  setOnPrev: (fn?: () => void) => void;
  setOnNext: (fn?: () => void) => void;
  setDisableActions: (v: boolean) => void;
}

/* =========================
   Problem Type
   ========================= */
interface Problem {
  id: number;
  title: string;
  description: string;
  constraints: string;
  examples: {
    input: string;
    output: string;
    explanation: string;
  }[];
}

export default function ProblemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    setOnRun,
    setOnSubmit,
    setOnPrev,
    setOnNext,
    setDisableActions,
  } = useOutletContext<LayoutContext>();

  /* =========================
     State
     ========================= */
  const [problem, setProblem] = useState<Problem | null>(null);
  const [problemIds, setProblemIds] = useState<number[]>([]);

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<Language>("python");

  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [loading, setLoading] = useState(false);

  /* =========================
     Pagination
     ========================= */
  const currentIndex = problemIds.indexOf(Number(id));
  const prevId =
    currentIndex > 0 ? problemIds[currentIndex - 1] : undefined;
  const nextId =
    currentIndex >= 0 && currentIndex < problemIds.length - 1
      ? problemIds[currentIndex + 1]
      : undefined;

  /* =========================
     Fetch Problem
     ========================= */
  useEffect(() => {
    if (!id) return;

    axios
      .get(`http://localhost:5000/api/problems/${id}`)
      .then((res) => setProblem(res.data));
  }, [id]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/problems").then((res) => {
      setProblemIds(res.data.map((p: any) => p.id));
    });
  }, []);

  /* =========================
     Fetch Test Cases
     ========================= */
  useEffect(() => {
    if (!id) return;

    axios
      .get(`http://localhost:5000/api/problems/${id}/testcases`)
      .then((res) => setTestCases(res.data.testCases))
      .catch(() => setTestCases([]));
  }, [id]);

  /* =========================
     RUN
     ========================= */
  const handleRun = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setDisableActions(true);
      setResults(null);

      const res = await axios.post(
        "http://localhost:5000/api/judge/run",
        {
          problemId: Number(id),
          code,
          language,
        }
      );

      setResults(res.data.results);
    } finally {
      setLoading(false);
      setDisableActions(false);
    }
  }, [id, code, language, setDisableActions]);

  /* =========================
     SUBMIT
     ========================= */
  const handleSubmit = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setDisableActions(true);
      setResults(null);

      const res = await axios.post(
        "http://localhost:5000/api/judge/submit",
        {
          problemId: Number(id),
          code,
          language,
        }
      );

      setResults(res.data.results);
    } finally {
      setLoading(false);
      setDisableActions(false);
    }
  }, [id, code, language, setDisableActions]);

  /* =========================
     Navbar Sync
     ========================= */
  useEffect(() => {
    setOnRun(() => handleRun);
    setOnSubmit(() => handleSubmit);
    setOnPrev(prevId ? () => () => navigate(`/problems/${prevId}`) : undefined);
    setOnNext(nextId ? () => () => navigate(`/problems/${nextId}`) : undefined);

    return () => {
      setOnRun(undefined);
      setOnSubmit(undefined);
      setOnPrev(undefined);
      setOnNext(undefined);
      setDisableActions(false);
    };
  }, [
    handleRun,
    handleSubmit,
    prevId,
    nextId,
    navigate,
    setOnRun,
    setOnSubmit,
    setOnPrev,
    setOnNext,
    setDisableActions,
  ]);

  /* =========================
     Loading
     ========================= */
  if (!problem) {
    return (
      <div className="h-screen bg-[#1a1a1a] flex items-center justify-center text-slate-500">
        Loading problem...
      </div>
    );
  }

  /* =========================
     Render
     ========================= */
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-56px)] bg-[#1a1a1a] overflow-hidden text-[#eff1f6]">
      {/* LEFT PANEL */}
      <div className="border-r border-[#333] overflow-y-auto p-8">
        <h1 className="text-2xl font-semibold mb-4">
          {problem.title}
        </h1>

        <p className="whitespace-pre-line text-[#eff1f6d9] mb-8">
          {problem.description}
        </p>

        <h3 className="text-sm font-bold mb-4">Examples</h3>
        <div className="space-y-6">
          {problem.examples.map((ex, i) => (
            <div
              key={i}
              className="bg-[#2a2a2a] p-4 rounded-lg border border-[#333] font-mono text-sm"
            >
              <p><b>Input:</b> {ex.input}</p>
              <p><b>Output:</b> {ex.output}</p>
              {ex.explanation && (
                <p className="italic mt-2">{ex.explanation}</p>
              )}
            </div>
          ))}
        </div>

        <h3 className="text-sm font-bold mt-8 mb-4">
          Constraints
        </h3>
        <div className="space-y-2">
          {problem.constraints.split("\n").map((c, i) => (
            <div
              key={i}
              className="text-xs font-mono bg-[#2a2a2a] p-2 rounded border border-[#333]"
            >
              {c}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex flex-col h-full bg-[#1e1e1e] overflow-hidden">
        {/* Editor (Top Half) */}
        <div className="flex-[6] min-h-0 overflow-hidden bg-[#1e1e1e]">
          <CodeEditor
            code={code}
            setCode={setCode}
            language={language}
            setLanguage={setLanguage}
          />
        </div>



        {/* Output */}
        <div className="flex-[4] min-h-0 bg-[#1a1a1a] overflow-hidden">
          <div className="h-full p-4 overflow-hidden">
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
