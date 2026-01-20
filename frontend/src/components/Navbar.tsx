import { Link, useMatch } from "react-router-dom";
import {
  PlayIcon,
  CloudIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
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
  // ✅ Show controls ONLY on problem detail pages
  const isProblemPage = useMatch("/problems/:id");

  // fake auth (replace later)
  const isLoggedIn = false;

  return (
    <nav className="h-14 px-6 border-b border-slate-800 flex items-center justify-between bg-[#0f0f0f]">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        {isProblemPage && (
          <>
            <button
              onClick={onPrev}
              disabled={!onPrev}
              className="flex items-center gap-1 text-slate-400 hover:text-white disabled:opacity-30"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              Prev
            </button>

            <button
              onClick={onNext}
              disabled={!onNext}
              className="flex items-center gap-1 text-slate-400 hover:text-white disabled:opacity-30"
            >
              Next
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </>
        )}

        <Link to="/problems" className="font-bold text-indigo-400 ml-4">
          Problems
        </Link>

        <Link
          to="/playground"
          className="text-slate-400 hover:text-white"
        >
          Playground
        </Link>
      </div>

      {/* CENTER — Run / Submit ONLY on problem page */}
      {isProblemPage && (
        <div className="flex items-center gap-4">
          <button
            onClick={onRun}
            disabled={disableActions}
            className="flex items-center gap-2 px-4 py-1.5 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-40"
          >
            <PlayIcon className="w-4 h-4" />
            Run
          </button>

          <button
            onClick={onSubmit}
            disabled={disableActions}
            className="flex items-center gap-2 px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40"
          >
            Submit
          </button>
        </div>
      )}

      {/* RIGHT */}
      <div>
        {isLoggedIn ? (
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
            <CloudIcon className="w-4 h-4 text-white" />
          </div>
        ) : (
          <div className="flex gap-4 text-sm">
            <button className="text-slate-400 hover:text-white">
              Login
            </button>
            <button className="text-indigo-400 font-semibold">
              Register
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
