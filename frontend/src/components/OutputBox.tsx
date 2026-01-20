import { useState } from "react";

interface OutputBoxProps {
  output: string | null;
  loading: boolean;
  onRun: (input: string) => void;
  onSubmit: (input: string) => void;
}

const OutputBox = ({ output, loading, onRun, onSubmit }: OutputBoxProps) => {
  const [input, setInput] = useState("");

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a] font-mono p-4">
      
      {/* 1. Input Section */}
      <div className="flex flex-col gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter input here (stdin)..."
          className="w-full h-32 resize-none rounded-lg bg-[#2a2a2a] text-[#eff1f6] p-4 text-sm outline-none border border-[#333] focus:border-[#2db55d] transition-colors placeholder:text-slate-600"
        />

        {/* 2. Run & Submit Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => onRun(input)}
            className="px-6 py-2 rounded-md bg-[#333] text-[#eff1f6] text-xs font-bold uppercase hover:bg-[#444] transition-all active:scale-95"
          >
            Run
          </button>

          <button
            onClick={() => onSubmit(input)}
            className="px-6 py-2 rounded-md bg-[#2db55d] text-white text-xs font-bold uppercase hover:bg-[#269e50] transition-all active:scale-95"
          >
            Submit
          </button>
        </div>
      </div>

      {/* 3. Output Section */}
      <div className="flex-1 min-h-0 mt-6 flex flex-col overflow-hidden">
        <p className="text-[#8a8a8a] text-[11px] mb-3 uppercase font-bold tracking-widest">
          Your Output
        </p>

        {/* This area scrolls if output is long */}
        <div className="flex-1 overflow-y-auto scrollbar-hide rounded-lg border border-[#333] bg-[#2a2a2a]">
          {loading ? (
            <div className="flex items-center gap-3 p-4">
              <div className="w-2 h-2 rounded-full bg-[#2db55d] animate-pulse"></div>
              <p className="text-[#8a8a8a] italic text-sm">Running code...</p>
            </div>
          ) : (
            <pre className="p-4 text-[#eff1f6] text-sm font-mono whitespace-pre-wrap leading-relaxed">
              {output ?? (
                <span className="text-slate-600 italic">No output yet. Run your code to see results.</span>
              )}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutputBox;