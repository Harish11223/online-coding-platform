import { Link, useMatch } from "react-router-dom";
import {
  PlayIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Bars3Icon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

interface NavbarProps {
  onRun?: () => void;
  onSubmit?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  disableActions?: boolean;
}

export default function Navbar({
  onRun,
  onSubmit,
  onPrev,
  onNext,
  disableActions = false,
}: NavbarProps) {
  const isProblemPage = useMatch("/problems/:id");
  const isLoggedIn = false;

  return (
    <nav className="h-12 px-4 flex items-center justify-between bg-gradient-to-b from-[#111] to-[#0b0b0b] border-b border-[#222] text-sm">

      {/* ================= LEFT ================= */}
      <div className="flex items-center gap-3 text-slate-300">
        <ArrowLeftIcon className="w-4 h-4 cursor-pointer hover:text-white" />
        <Bars3Icon className="w-4 h-4 cursor-pointer hover:text-white" />

        <span className="font-semibold text-white">
          Problem List
        </span>

        {isProblemPage && (
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={onPrev}
              disabled={!onPrev}
              className="p-1 rounded hover:bg-[#1f1f1f] disabled:opacity-30"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>

            <button
              onClick={onNext}
              disabled={!onNext}
              className="p-1 rounded hover:bg-[#1f1f1f] disabled:opacity-30"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* ================= CENTER ================= */}
      {isProblemPage && (
        <div className="flex items-center gap-3">
          <button
            onClick={onRun}
            disabled={disableActions}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#1f1f1f] text-slate-300 hover:bg-[#2a2a2a] disabled:opacity-40"
          >
            <PlayIcon className="w-4 h-4" />
            Run
          </button>

          <button
            onClick={onSubmit}
            disabled={disableActions}
            className="flex items-center gap-1.5 px-4 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40"
          >
            <PlayIcon className="w-4 h-4" />
            Submit
          </button>
        </div>
      )}

      {/* ================= RIGHT ================= */}
      <div>
        {isLoggedIn ? (
          <div className="w-8 h-8 rounded-full bg-indigo-500" />
        ) : (
          <button className="px-4 py-1 rounded-md bg-[#3a2a10] text-amber-400 hover:bg-[#4a3414] font-medium">
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
