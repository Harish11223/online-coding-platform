import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Problem {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export default function ProblemListPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<Problem[]>("http://localhost:5000/api/problems")
      .then((res) => setProblems(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-slate-400">Loading problems...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Problems</h1>

      <table className="w-full border border-slate-800 rounded-lg overflow-hidden">
        <thead className="bg-[#1a1a1a]">
          <tr>
            <th className="text-left px-4 py-3 text-sm text-slate-400">
              Title
            </th>
            <th className="text-left px-4 py-3 text-sm text-slate-400">
              Difficulty
            </th>
          </tr>
        </thead>

        <tbody>
          {problems.map((problem) => (
            <tr
              key={problem.id}
              onClick={() => navigate(`/problems/${problem.id}`)}
              className="cursor-pointer hover:bg-[#1a1a1a] transition-colors"
            >
              <td className="px-4 py-3 border-t border-slate-800">
                {problem.title}
              </td>
              <td className="px-4 py-3 border-t border-slate-800">
                <DifficultyBadge difficulty={problem.difficulty} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* =========================
   Difficulty Badge
   ========================= */
function DifficultyBadge({
  difficulty,
}: {
  difficulty: "Easy" | "Medium" | "Hard";
}) {
  const color =
    difficulty === "Easy"
      ? "text-emerald-400"
      : difficulty === "Medium"
        ? "text-yellow-400"
        : "text-rose-400";

  return <span className={`font-semibold ${color}`}>{difficulty}</span>;
}
