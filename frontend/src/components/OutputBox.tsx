import { useState, useEffect } from "react";
import { TestCase } from "../types/problem";

/* =========================
   Types
   ========================= */

interface JudgeCase {
  input: any;
  output: string;
  expected: string;
  passed: boolean;
}

interface JudgeResult {
  status: string;
  runtime: string;
  cases: JudgeCase[];
}

interface OutputBoxProps {
  loading: boolean;
  testCases?: TestCase[];
  results?: JudgeResult | null;
}

/* =========================
   Helpers
   ========================= */

/* Render value like LeetCode */
function renderValue(value: any) {
  if (Array.isArray(value)) {
    return `[${value.join(", ")}]`;
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}

/* =========================
   Component
   ========================= */

export default function OutputBox({
  loading,
  testCases = [],
  results = null,
}: OutputBoxProps) {
  const [tab, setTab] = useState<"testcase" | "result">("testcase");
  const [activeCase, setActiveCase] = useState(0);

  /* Auto switch to Result tab */
  useEffect(() => {
    if (results) {
      setTab("result");
      setActiveCase(0);
    }
  }, [results]);

  /* Reset index on tab change */
  useEffect(() => {
    setActiveCase(0);
  }, [tab]);

  const activeTestCase = testCases[activeCase];
  const activeResultCase = results?.cases?.[activeCase];

  return (
    <div className="h-full flex flex-col bg-[#262626] rounded-lg border border-[#333] overflow-hidden">

      {/* ================= Tabs ================= */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] border-b border-[#333] text-sm">
        <button
          onClick={() => setTab("testcase")}
          className={`font-semibold ${
            tab === "testcase" ? "text-green-400" : "text-slate-400"
          }`}
        >
          Testcase
        </button>
        <span className="text-slate-500">›</span>
        <button
          onClick={() => setTab("result")}
          className={`font-semibold ${
            tab === "result" ? "text-green-400" : "text-slate-400"
          }`}
        >
          Test Result
        </button>
      </div>

      {/* ================= Scroll Area ================= */}
      <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-[#3a3a3a] scrollbar-track-[#1f1f1f]">

        {/* ================= TESTCASE TAB ================= */}
        {tab === "testcase" && (
          <>
            {/* Case Tabs */}
            <div className="flex gap-2 mb-4">
              {testCases.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveCase(i)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    i === activeCase
                      ? "bg-[#3a3a3a] text-white"
                      : "text-slate-400 hover:bg-[#333]"
                  }`}
                >
                  Case {i + 1}
                </button>
              ))}
            </div>

            {/* Input */}
            {activeTestCase?.input && (
              <div className="space-y-4">
                <p className="text-xs text-slate-400">Input</p>

                {Object.entries(activeTestCase.input).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <p className="text-sm text-slate-300">{key} =</p>
                    <pre className="bg-[#1f1f1f] px-4 py-2 rounded font-mono text-sm text-white">
                      {renderValue(value)}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ================= RESULT TAB ================= */}
        {tab === "result" && (
          <>
            {loading && (
              <p className="text-slate-400 italic">
                Running test cases...
              </p>
            )}

            {!loading && !results && (
              <p className="text-slate-500">
                You must run your code first
              </p>
            )}

            {!loading && results && (
              <>
                {/* Verdict */}
                <div className="flex items-center gap-4 mb-4">
                  <h2
                    className={`text-lg font-semibold ${
                      results.status === "Accepted"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {results.status}
                  </h2>
                  <span className="text-slate-400">
                    Runtime: {results.runtime}
                  </span>
                </div>

                {/* Case Tabs */}
                <div className="flex gap-2 mb-4">
                  {results.cases.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveCase(i)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        c.passed ? "bg-green-600" : "bg-red-600"
                      }`}
                    >
                      Case {i + 1}
                    </button>
                  ))}
                </div>

                {/* Case Details */}
                {activeResultCase && (
                  <div className="space-y-4">

                    {/* Input */}
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Input</p>
                      {Object.entries(activeResultCase.input).map(([k, v]) => (
                        <div key={k} className="mb-2">
                          <p className="text-sm text-slate-300">{k} =</p>
                          <pre className="bg-[#1f1f1f] px-4 py-2 rounded font-mono text-sm">
                            {renderValue(v)}
                          </pre>
                        </div>
                      ))}
                    </div>

                    {/* Output */}
                    <div>
                      <p className="text-xs text-slate-400">Your Output</p>
                      <pre className="bg-[#1f1f1f] p-3 rounded font-mono text-sm">
                        {activeResultCase.output || "—"}
                      </pre>
                    </div>

                    {/* Expected */}
                    <div>
                      <p className="text-xs text-slate-400">Expected</p>
                      <pre className="bg-[#1f1f1f] p-3 rounded font-mono text-sm">
                        {activeResultCase.expected}
                      </pre>
                    </div>

                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
