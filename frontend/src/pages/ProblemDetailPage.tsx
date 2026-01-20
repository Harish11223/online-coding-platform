import {
  useParams,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import CodeEditor from "../components/CodeEditor";
import OutputBox from "../components/OutputBox";
import Tabs from "../components/Tabs";
import LanguageSelector from "../components/LanguageSelector";
import { Language } from "../types/language";

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

  const [problem, setProblem] = useState<Problem | null>(null);
  const [problemIds, setProblemIds] = useState<number[]>([]);

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<Language>("python");
  const [customInput, setCustomInput] = useState("");

  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"cases" | "result">("cases");

  const [loading, setLoading] = useState(false);

  /* =========================
      Pagination Logic
     ========================= */
  const currentIndex = problemIds.indexOf(Number(id));
  const prevId = currentIndex > 0 ? problemIds[currentIndex - 1] : undefined;
  const nextId = currentIndex >= 0 && currentIndex < problemIds.length - 1
      ? problemIds[currentIndex + 1]
      : undefined;

  /* =========================
      Data Fetching
     ========================= */
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/problems/${id}`)
      .then((res) => {
        setProblem(res.data);
        if (res.data.examples?.[0]) {
          setCustomInput(res.data.examples[0].input);
        }
      });
  }, [id]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/problems").then((res) => {
      setProblemIds(res.data.map((p: any) => p.id));
    });
  }, []);

  /* =========================
      Execution Handlers
     ========================= */
  const handleRun = useCallback(async () => {
    try {
      setLoading(true);
      setDisableActions(true);
      setActiveTab("result");

      const res = await axios.post(
        "http://localhost:5000/api/judge/run",
        { code, language, input: customInput }
      );

      if (res.data.compile_output) {
        setResult({ verdict: "Compile Error", error: res.data.compile_output });
      } else if (res.data.stderr) {
        setResult({ verdict: "Runtime Error", error: res.data.stderr });
      } else {
        setResult({ verdict: "Output", output: res.data.stdout || "No output" });
      }
    } finally {
      setLoading(false);
      setDisableActions(false);
    }
  }, [code, language, customInput, setDisableActions]);

  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);
      setDisableActions(true);
      setActiveTab("result");

      const res = await axios.post(
        "http://localhost:5000/api/judge/submit",
        { problemId: Number(id), code, language }
      );

      setResult(res.data);
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
  }, [handleRun, handleSubmit, prevId, nextId, navigate, setOnRun, setOnSubmit, setOnPrev, setOnNext, setDisableActions]);

  if (!problem) {
    return <div className="h-screen bg-[#1a1a1a] flex items-center justify-center text-slate-500 font-medium">Loading problem...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-56px)] overflow-hidden bg-[#1a1a1a] text-[#eff1f6]">
      
      {/* LEFT PANEL: Problem Description */}
      <div className="flex flex-col h-full border-r border-[#333] overflow-y-auto p-8 scrollbar-hide">
        <h1 className="text-2xl font-semibold mb-2">{problem.title}</h1>
        
        <div className="flex items-center gap-2 mb-6">
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#2c3e2d] text-[#2db55d]">
            Easy
          </span>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="whitespace-pre-line text-[#eff1f6d9] text-[15px] leading-relaxed">
            {problem.description}
          </p>
          
          <h3 className="text-sm font-bold mt-8 mb-4">Examples</h3>
          <div className="space-y-6 text-[15px]">
            {problem.examples.map((ex, i) => (
              <div key={i} className="bg-[#2a2a2a] p-4 rounded-lg border border-[#383838] font-mono text-sm leading-relaxed">
                <p className="mb-2"><span className="text-white font-bold">Input:</span> <span className="text-[#eff1f6d9]">{ex.input}</span></p>
                <p className="mb-2"><span className="text-white font-bold">Output:</span> <span className="text-[#eff1f6d9]">{ex.output}</span></p>
                {ex.explanation && (
                  <p className="text-[#eff1f6d9] mt-2 italic font-sans border-t border-[#383838] pt-2">
                    <span className="font-bold not-italic">Explanation:</span> {ex.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>

          <h3 className="text-sm font-bold mt-8 mb-4">Constraints</h3>
          <div className="flex flex-wrap gap-2">
            {problem.constraints.split('\n').map((c, idx) => (
              <span key={idx} className="bg-[#2a2a2a] text-[#eff1f6d9] px-2.5 py-1 rounded text-xs font-mono border border-[#333]">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Editor + Output Stack */}
      <div className="flex flex-col h-full overflow-hidden bg-[#1e1e1e]">
        
        {/* Editor (Top Half) */}
        <div className="flex-[6] flex flex-col min-h-0 border-b border-[#333]">
          <div className="flex items-center justify-between px-4 py-2 bg-[#2a2a2a] border-b border-[#333]">
             <div className="flex items-center gap-4">
                <span className="text-[#2db55d] text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-[#2db55d]"></div>
                   Code
                </span>
                <LanguageSelector language={language} setLanguage={setLanguage} />
             </div>
             <span className="text-[#555] text-xs font-mono">
               main.{language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : 'js'}
             </span>
          </div>
          <div className="flex-1 relative overflow-hidden bg-[#1e1e1e]">
            <CodeEditor
              code={code}
              setCode={setCode}
              language={language}
            />
          </div>
        </div>

        {/* Output Section (Bottom Half) */}
        <div className="flex-[4] flex flex-col min-h-0 bg-[#1a1a1a]">
          {/* Tabs Navigation */}
          <div className="flex items-center px-4 py-1 bg-[#2a2a2a] border-b border-[#333]">
            <Tabs
              active={activeTab}
              onChange={setActiveTab}
              tabs={[
                { key: "cases", label: "Test Cases" },
                { key: "result", label: "Test Result" },
              ]}
            />
          </div>

          {/* Dynamic Content Area */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            {activeTab === "cases" ? (
              <div className="space-y-6 animate-in fade-in duration-300">
                 <div>
                    <p className="text-xs font-bold text-[#8a8a8a] uppercase tracking-widest mb-3">Custom Input</p>
                    <textarea 
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="Enter input here (stdin)"
                      className="w-full h-32 resize-none rounded-lg bg-[#2a2a2a] text-[#eff1f6] p-4 text-sm outline-none border border-[#333] focus:border-[#2db55d] transition-colors font-mono"
                    />
                 </div>
                 <div className="flex gap-3">
                    <button 
                      onClick={handleRun}
                      className="px-6 py-2 rounded-md bg-[#333] text-[#eff1f6] text-xs font-bold uppercase hover:bg-[#444] transition-all active:scale-95"
                    >
                      Run
                    </button>
                    <button 
                      onClick={handleSubmit}
                      className="px-6 py-2 rounded-md bg-[#2db55d] text-white text-xs font-bold uppercase hover:bg-[#269e50] transition-all active:scale-95"
                    >
                      Submit
                    </button>
                 </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Result Section (Mirrors Input Layout) */}
                <div>
                  <p className="text-xs font-bold text-[#8a8a8a] uppercase tracking-widest mb-3">Your Output</p>
                  <div className="bg-[#2a2a2a] rounded-lg border border-[#333] min-h-[128px]">
                    <div className="p-4 overflow-hidden">
                      <OutputBox
                        result={result}
                        loading={loading}
                        onClear={() => setResult(null)}
                      />
                    </div>
                  </div>
                </div>

                {!loading && result && (
                  <div className="animate-in slide-in-from-bottom-2 duration-500">
                    <p className="text-xs font-bold text-[#8a8a8a] uppercase tracking-widest mb-3">Status</p>
                    <div className="bg-[#2a2a2a] p-4 rounded-lg border border-[#333] text-sm font-mono flex items-center gap-3">
                       <span className={result.verdict === "Accepted" ? "text-[#2db55d] font-bold" : "text-red-400 font-bold"}>
                          {result.verdict || "Executed"}
                       </span>
                       <span className="text-[#333]">|</span>
                       <span className="text-[#eff1f6d9]">Runtime: {result.runtime || "42ms"}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}