import { CodeBracketIcon } from "@heroicons/react/24/outline";

const LanguageSelector = ({ language, setLanguage }) => {
  const languages = [
    { id: "cpp", name: "C++", color: "text-blue-400" },
    { id: "java", name: "Java", color: "text-red-400" },
    { id: "python", name: "Python", color: "text-yellow-400" },
    { id: "javascript", name: "JavaScript", color: "text-amber-300" },
  ];

  return (
    <div className="flex items-center gap-3">
      <label className="hidden md:block text-xs font-bold text-slate-500 uppercase tracking-widest">
        Language
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <CodeBracketIcon className="w-4 h-4 text-slate-400" />
        </div>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="appearance-none bg-[#1e1e1e] text-slate-200 text-sm font-medium rounded-lg border border-slate-700 pl-10 pr-10 py-2.5 cursor-pointer hover:border-slate-500 hover:bg-[#252526] transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          {languages.map((lang) => (
            <option key={lang.id} value={lang.id} className="bg-[#1e1e1e]">
              {lang.name}
            </option>
          ))}
        </select>
        {/* Custom Chevron Arrow */}
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;