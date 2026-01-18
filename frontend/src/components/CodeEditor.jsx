import Editor from "@monaco-editor/react";

const CodeEditor = ({ code, setCode, language }) => {
  return (
    <div className="flex flex-col w-full h-full overflow-hidden border border-slate-700 rounded-xl bg-[#1e1e1e] shadow-2xl">
      {/* Tab/Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-slate-700">
        <div className="flex items-center gap-2">
          {/* Decorative "Mac-style" dots */}
          <div className="flex gap-1.5 mr-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-medium tracking-wider text-slate-400 uppercase">
            main.{language === "javascript" ? "js" : language}
          </span>
        </div>
        
        <div className="px-2 py-1 text-[10px] font-bold text-slate-500 bg-slate-800 rounded uppercase tracking-widest">
          {language}
        </div>
      </div>

      {/* Editor Wrapper */}
      <div className="flex-grow pt-2">
        <Editor
          height="60vh"
          theme="vs-dark"
          language={language}
          value={code}
          onChange={(value) => setCode(value)}
          options={{
            fontSize: 14,
            fontFamily: "'Fira Code', 'Cascadia Code', monospace",
            minimap: { enabled: false },
            padding: { top: 16 },
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            lineNumbersMinChars: 3,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;