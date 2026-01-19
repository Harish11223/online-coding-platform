interface OutputBoxProps {
  output: string;
  loading: boolean;
  onClear: () => void;
}

const OutputBox = ({
  output,
  loading,
  onClear,
}: OutputBoxProps) => {
  return (
    <div className="flex flex-col flex-grow bg-[#0c0c0c] border border-slate-800 rounded-xl overflow-hidden font-mono shadow-inner">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a1a] border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Output Console
          </span>
        </div>

        {output && (
          <button
            onClick={onClear}
            className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors uppercase font-bold"
          >
            Clear
          </button>
        )}
      </div>

      {/* Terminal Content */}
      <div className="p-4 overflow-y-auto h-full min-h-[150px] custom-scrollbar">
        {loading ? (
          <div className="flex items-center gap-2 text-indigo-400">
            <span className="animate-bounce">●</span>
            <span className="animate-bounce [animation-delay:0.2s]">●</span>
            <span className="animate-bounce [animation-delay:0.4s]">●</span>
            <span className="text-sm ml-2 italic text-slate-500">
              Executing code...
            </span>
          </div>
        ) : (
          <pre
            className={`text-sm leading-relaxed whitespace-pre-wrap ${
              output.includes("Error") || output.includes("❌")
                ? "text-rose-400"
                : "text-slate-300"
            }`}
          >
            {output || (
              <span className="text-slate-600 italic">
                {">"} system: awaiting execution...
              </span>
            )}
          </pre>
        )}
      </div>
    </div>
  );
};

export default OutputBox;
