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
      {/* ================= Breadcrumb Tabs ================= */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#1f1f1f] border-b border-[#333] text-sm">
        <button
          onClick={() => setTab("testcase")}
          className={`font-semibold ${tab === "testcase" ? "text-green-400" : "text-slate-400"
            }`}
        >
          Testcase
        </button>
        <span className="text-slate-500">›</span>
        <button
          onClick={() => setTab("result")}
          className={`font-semibold ${tab === "result" ? "text-green-400" : "text-slate-400"
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
                  className={`px-3 py-1 rounded-md text-sm ${i === activeCase
                      ? "bg-[#3a3a3a] text-white"
                      : "text-slate-400 hover:bg-[#333]"
                    }`}
                >
                  Case {i + 1}
                </button>
              ))}
              <button className="px-3 py-1 text-slate-400 hover:bg-[#333] rounded-md">
                +
              </button>
            </div>

            {/* Case Content */}
            <div className="space-y-4">
              {tc ? (
                <>
                  {/* nums */}
                  <div>
                    <p className="text-xs text-slate-400 mb-1">nums =</p>
                    <div className="bg-[#3a3a3a] rounded-md px-4 py-2 font-mono text-sm text-white">
                      {tc.input.split("\n")[1] || ""}
                    </div>
                  </div>

                  {/* target */}
                  <div>
                    <p className="text-xs text-slate-400 mb-1">target =</p>
                    <div className="bg-[#3a3a3a] rounded-md px-4 py-2 font-mono text-sm text-white">
                      {tc.input.split("\n")[2] || ""}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-slate-500 italic">
                  No test case selected
                </p>
              )}
            </div>
          </div>
        )}

        {/* ================= TEST RESULT TAB ================= */}
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
