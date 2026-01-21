import Editor from "@monaco-editor/react";
import type { Dispatch, SetStateAction } from "react";
import { Language } from "../types/language";

interface CodeEditorProps {
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
  language: Language;
  setLanguage: Dispatch<SetStateAction<Language>>;
}

const LANGUAGES: { label: string; value: Language }[] = [
  { label: "C++", value: "cpp" },
  { label: "Python", value: "python" },
  { label: "JavaScript", value: "javascript" },
];

const CodeEditor = ({
  code,
  setCode,
  language,
  setLanguage,
}: CodeEditorProps) => {
  return (
    <div className="flex flex-col w-full h-full bg-[#1e1e1e] rounded-lg overflow-hidden border border-[#2f2f2f]">

      {/* ================= Top Bar ================= */}
      <div className="flex items-center px-4 py-2 bg-[#2a2a2a] border-b border-[#333]">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <span className="text-green-400 font-semibold">{`</>`}</span>
          <span className="font-medium">Code</span>
        </div>
      </div>

      {/* ================= Language Bar ================= */}
      <div className="flex items-center gap-2 px-4 py-1.5 bg-[#1f1f1f] border-b border-[#333] text-sm">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="bg-transparent text-slate-200 text-sm focus:outline-none"
        >
          {LANGUAGES.map((lang) => (
            <option
              key={lang.value}
              value={lang.value}
              className="bg-[#1e1e1e]"
            >
              {lang.label}
            </option>
          ))}
        </select>

      </div>

      {/* ================= Editor Wrapper ================= */}
      <div className="flex-1 p-2">
        <Editor
          theme="vs-dark"
          language={language}
          value={code}
          onChange={(value) => setCode(value ?? "")}
          options={{
            fontSize: 14,
            fontFamily: "Fira Code, monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: {
              top: 12,
              bottom: 12,
            },
          }}
        />
      </div>

    </div>
  );
};

export default CodeEditor;
