import { useState } from "react";
import { TestCase, TestResult } from "../types/problem";

interface OutputBoxProps {
  loading: boolean;
  testCases?: TestCase[];
  results?: TestResult[] | null;
}

export default function OutputBox({
  loading,
  testCases = [],
  results = null,
}: OutputBoxProps) {
  const [tab, setTab] = useState<"testcase" | "result">("testcase");
  const [activeCase, setActiveCase] = useState(0);

  const tc = testCases[activeCase];

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

      {/* ================= Content ================= */}
      <div className="flex-1 p-4 overflow-hidden">

        {/* ================= TESTCASE TAB ================= */}
        {tab === "testcase" && (
          <div className="h-full flex flex-col">

            {/* Case Tabs */}
            <div className="flex items-center gap-2 mb-4">
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

            {/* Case Content */}
            {tc ? (
              typeof tc.input === "object" && tc.input !== null ? (
                <div className="space-y-4">
                  {Object.entries(tc.input).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-xs text-slate-400 mb-1">
                        {key} =
                      </p>
                      <div className="bg-[#3a3a3a] rounded-md px-4 py-2 font-mono text-sm text-white whitespace-pre-wrap">
                        {JSON.stringify(value)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <p className="text-xs text-slate-400 mb-1">
                    Input
                  </p>
                  <pre className="bg-[#3a3a3a] rounded-md px-4 py-2 font-mono text-sm text-white whitespace-pre-wrap">
                    {tc.input}
                  </pre>
                </div>
              )
            ) : (
              <p className="text-slate-500 italic">
                No test case selected
              </p>
            )}
          </div>
        )}

        {/* ================= RESULT TAB ================= */}
        {tab === "result" && (
          <div className="h-full flex items-center justify-center">
            {loading ? (
              <p className="text-slate-400 italic">
                Running test cases...
              </p>
            ) : !results ? (
              <p className="text-slate-500">
                You must run your code first
              </p>
            ) : (
              <p className="text-green-400 font-semibold">
                Results available
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
