import { useEffect, useState } from "react";
import axios from "axios";
import { Problem } from "../types/problem";

interface Props {
  onSelect: (id: number) => void;
}

export default function ProblemList({ onSelect }: Props) {
  const [problems, setProblems] = useState<Problem[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/problems")
      .then((res) => setProblems(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Problems</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Difficulty</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((p) => (
            <tr
              key={p.id}
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => onSelect(p.id)}
            >
              <td className="p-2 border">{p.title}</td>
              <td className="p-2 border">{p.difficulty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
