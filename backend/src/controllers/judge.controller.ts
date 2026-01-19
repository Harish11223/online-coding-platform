import axios from "axios";
import { Request, Response } from "express";
import { Judge0Response } from "../types/judge0.js";

type Language = "cpp" | "java" | "python" | "javascript";

const languageMap: Record<Language, number> = {
  cpp: 54,
  java: 62,
  python: 71,
  javascript: 63,
};

interface RunCodeBody {
  code: string;
  language: Language;
  input?: string;
}

function isAxiosLikeError(
  error: unknown
): error is { response?: { data?: unknown }; message?: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  );
}

export const runCode = async (
  req: Request<{}, {}, RunCodeBody>,
  res: Response
): Promise<Response> => {
  try {
    const { code, language, input } = req.body;

    if (!languageMap[language]) {
      return res.status(400).json({ error: "Unsupported language" });
    }

    const response = await axios.post<Judge0Response>(
      `${process.env.JUDGE0_URL}/submissions/?wait=true`,
      {
        source_code: code,
        language_id: languageMap[language],
        stdin: input ?? "",
      }
    );

    return res.json(response.data);
  } catch (error: unknown) {
    if (isAxiosLikeError(error)) {
      console.error("Judge0 Error:", error.response?.data ?? error.message);
    } else {
      console.error("Unexpected Error:", error);
    }

    return res.status(500).json({ error: "Execution failed" });
  }
};
