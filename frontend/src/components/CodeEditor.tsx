import Editor from "@monaco-editor/react";
import type { Dispatch, SetStateAction } from "react";

interface CodeEditorProps {
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
  language: string;
}

const CodeEditor = ({ code, setCode, language }: CodeEditorProps) => {
  return (
    <div className="flex flex-col w-full h-full overflow-hidden rounded-xl bg-[#0f172a] border border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#020617] border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-2">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-amber-500/70" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
          </div>

          <span className="text-xs font-medium tracking-wider text-slate-400 uppercase">
            main.{language === "javascript" ? "js" : language}
          </span>
        </div>

        <span className="px-2 py-1 text-[10px] font-semibold text-slate-400 bg-slate-900 rounded uppercase tracking-widest">
          {language}
        </span>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          theme="vs-dark"
          language={language}
          value={code}
          onChange={(value) => setCode(value ?? "")}
          options={{
            fontSize: 14,
            fontFamily: "'Fira Code', 'Cascadia Code', monospace",
            minimap: { enabled: false },
            padding: { top: 16, bottom: 16 },
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            lineNumbersMinChars: 3,
            scrollBeyondLastLine: false,
            automaticLayout: true,

            // 👇 THIS enables proper scrolling
            scrollbar: {
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
              alwaysConsumeMouseWheel: false,
            },
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
