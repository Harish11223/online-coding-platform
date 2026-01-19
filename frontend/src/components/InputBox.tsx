import { PencilSquareIcon } from "@heroicons/react/24/outline";
import type { Dispatch, SetStateAction, ChangeEvent } from "react";

interface InputBoxProps {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
}

const InputBox = ({ input, setInput }: InputBoxProps) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="flex flex-col w-full mb-6">
      {/* Header Label */}
      <div className="flex items-center gap-2 mb-2 text-slate-400">
        <PencilSquareIcon className="w-4 h-4" />
        <label className="text-[10px] font-bold uppercase tracking-widest">
          Standard Input (stdin)
        </label>
      </div>

      {/* Textarea Container */}
      <div className="relative group">
        <textarea
          value={input}
          onChange={handleChange}
          placeholder={`Enter input values here...\n(e.g., 5 10)`}
          className="w-full h-28 bg-[#1a1a1a] text-slate-300 font-mono text-sm border border-slate-800 rounded-xl p-4 
                     placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 
                     transition-all duration-200 resize-none shadow-inner"
        />

        <div className="absolute bottom-3 right-3 opacity-20 pointer-events-none">
          <kbd className="px-2 py-1 text-[10px] bg-slate-700 rounded text-white font-sans">
            stdin
          </kbd>
        </div>
      </div>

      <p className="mt-2 text-[10px] text-slate-500 italic">
        * Provide values separated by space or newline.
      </p>
    </div>
  );
};

export default InputBox;
