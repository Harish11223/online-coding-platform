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
    <div className="flex flex-col w-full h-full bg-[#1e1e1e] overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 h-10 bg-[#2a2a2a] border-b border-[#333]">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <span className="text-green-400 font-semibold">{`</>`}</span>
          <span className="font-medium">Code</span>
        </div>

        {/* Language Selector */}
        <select
          value={language}
          onChange={(e) =>
            setLanguage(e.target.value as Language)
          }
          className="bg-[#1e1e1e] border border-[#333] text-slate-200 text-xs px-2 py-1 rounded focus:outline-none"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          theme="vs-dark"
          language={language}
          value={code}
          onChange={(value) => setCode(value ?? "")}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
