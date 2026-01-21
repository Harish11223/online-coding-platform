import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";

import CodeEditor from "../components/CodeEditor";
import OutputBox from "../components/OutputBox";

import { Language } from "../types/language";
import { TestCase, TestResult } from "../types/problem";

/* =========================
   Interfaces
   ========================= */
interface LayoutContext {
  setOnRun: (fn?: () => void) => void;
  setOnSubmit: (fn?: () => void) => void;
  setOnPrev: (fn?: () => void) => void;
  setOnNext: (fn?: () => void) => void;
  setDisableActions: (v: boolean) => void;
}

interface Problem {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  constraints: string;
  examples: {
    input: string;
    output: string;
    explanation: string;
  }[];
}

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
  const [results, setResults] = useState<JudgeResult | null>(null);
  const [loading, setLoading] = useState(false);

  /* =========================
      Pagination Logic
     ========================= */
  const { prevId, nextId } = useMemo(() => {
    const currentIndex = problemIds.indexOf(Number(id));
    return {
      prevId: currentIndex > 0 ? problemIds[currentIndex - 1] : undefined,
      nextId: currentIndex >= 0 && currentIndex < problemIds.length - 1 ? problemIds[currentIndex + 1] : undefined
    };
  }, [id, problemIds]);

  /* =========================
      Data Fetching
     ========================= */
  useEffect(() => {
    if (!id) return;
    axios.get(`http://localhost:5000/api/problems/${id}`).then((res) => setProblem(res.data));
  }, [id]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/problems").then((res) => {
      setProblemIds(res.data.map((p: any) => p.id));
    });
  }, []);

  useEffect(() => {
    if (!id) return;
    axios
      .get(`http://localhost:5000/api/problems/${id}/testcases`)
      .then((res) => setTestCases(res.data.testCases))
      .catch(() => setTestCases([]));
  }, [id]);

  /* =========================
      Handlers (Memoized)
     ========================= */
  const handleRun = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setDisableActions(true);
      const res = await axios.post("http://localhost:5000/api/judge/run", {
        problemId: Number(id), code, language
      });
      setResults(res.data);
    } finally {
      setLoading(false);
      setDisableActions(false);
    }
  }, [id, code, language, setDisableActions]);

  const handleSubmit = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setDisableActions(true);
      const res = await axios.post("http://localhost:5000/api/judge/submit", {
        problemId: Number(id), code, language
      });
      setResults(res.data);
    } finally {
      setLoading(false);
      setDisableActions(false);
    }
  }, [id, code, language, setDisableActions]);

  const handlePrev = useCallback(() => {
    if (prevId) navigate(`/problems/${prevId}`);
  }, [prevId, navigate]);

  const handleNext = useCallback(() => {
    if (nextId) navigate(`/problems/${nextId}`);
  }, [nextId, navigate]);

  /* =========================
      Navbar Sync (THE FIX)
     ========================= */
  useEffect(() => {
    // Factory function wrap to prevent immediate execution
    setOnRun(() => handleRun);
    setOnSubmit(() => handleSubmit);
    setOnPrev(prevId ? () => handlePrev : undefined);
    setOnNext(nextId ? () => handleNext : undefined);

    return () => {
      setOnRun(undefined);
      setOnSubmit(undefined);
      setOnPrev(undefined);
      setOnNext(undefined);
    };
  }, [handleRun, handleSubmit, handlePrev, handleNext, prevId, nextId, setOnRun, setOnSubmit, setOnPrev, setOnNext]);

  if (!problem) return <div className="h-screen bg-[#1a1a1a] flex items-center justify-center text-slate-500">Loading...</div>;

  return (
    <div className="grid grid-cols-1 p-2 lg:grid-cols-2 h-[calc(100vh-56px)] bg-[#0f0f0f] overflow-hidden text-[#eff1f6]">
      {/* LEFT PANEL */}
      <div className="h-full flex flex-col bg-[#262626] rounded-lg border border-[#333] overflow-hidden">
        <div className="px-4 py-2 bg-[#2a2a2a] border-b border-[#333] text-sm font-semibold text-green-400">
          Description
        </div>

        <div className="flex-1 p-6 overflow-y-auto text-slate-200">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">{problem.id}{". "}{problem.title}</h1>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white p-1 rounded bg-slate-600">Difficulty</span>
              <DifficultyBadge difficulty={problem.difficulty} />
            </div>
          </div>

          <div className="space-y-4 text-sm leading-relaxed text-[#eff1f6d9]">
            {problem.description.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <h3 className="text-sm font-bold mt-8 mb-4 uppercase tracking-wider text-slate-400">Example</h3>
          <div className="space-y-6">
            {problem.examples.map((ex, i) => (
              <div key={i} className="pl-4 border-l-2 border-[#444] font-mono text-sm bg-[#2a2a2a]/50 py-3 pr-4 rounded-r">
                <p><span className="text-slate-400">Input:</span> {ex.input}</p>
                <p><span className="text-slate-400">Output:</span> {ex.output}</p>
                {ex.explanation && (
                  <p className="mt-2 text-slate-500 italic text-xs">
                    <b>Explanation:</b> {ex.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>

          <h3 className="text-sm font-bold mt-8 mb-4 uppercase tracking-wider text-slate-400">Constraints</h3>
          <div className="flex flex-wrap gap-2 mb-8">
            {problem.constraints.split("\n").map((c, i) => (
              <div key={i} className="bg-[#333] border border-[#444] rounded px-3 py-1.5 text-[11px] font-mono text-emerald-400">
                {c}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex flex-col h-full overflow-hidden ml-2">
        <div className="flex-[6] mb-2 min-h-0">
          <CodeEditor
            code={code}
            setCode={setCode}
            language={language}
            setLanguage={setLanguage}
          />
        </div>
        <div className="flex-[4] min-h-0 bg-[#262626] h-full rounded-lg border border-[#333] overflow-hidden">
          <OutputBox loading={loading} testCases={testCases} results={results} />
        </div>
      </div>
    </div>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: "Easy" | "Medium" | "Hard" }) {
  const bgColor = difficulty === "Easy" ? "bg-emerald-500" : difficulty === "Medium" ? "bg-yellow-500" : "bg-rose-500";
  return (
    <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider ${bgColor}`}>
      {difficulty}
    </span>
  );
}