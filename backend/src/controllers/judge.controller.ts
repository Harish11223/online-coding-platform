import axios from "axios";
import { Request, Response } from "express";
import { pool } from "../db/index.js";
import { Judge0Response } from "../types/judge0.js";

/* =========================
   Language Mapping
   ========================= */

type Language = "cpp" | "java" | "python" | "javascript";

const languageMap: Record<Language, number> = {
  cpp: 54,
  java: 62,
  python: 71,
  javascript: 63,
};

/* =========================
   Helpers
   ========================= */

const JUDGE0_URL = process.env.JUDGE0_URL as string;

/* =========================
   RUN CODE
   ========================= */

export const runCode = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { problemId, code, language } = req.body as {
      problemId: number;
      code: string;
      language: Language;
    };

    if (!languageMap[language]) {
      return res.status(400).json({ error: "Unsupported language" });
    }

    const { rows: testCases } = await pool.query(
      `
      SELECT input, expected_output
      FROM test_cases
      WHERE problem_id = $1
        AND is_hidden = false
      ORDER BY id ASC
      `,
      [problemId]
    );

    const results = [];

    for (const tc of testCases) {
      const response = await axios.post<Judge0Response>(
        `${JUDGE0_URL}/submissions?wait=true`,
        {
          source_code: code,
          language_id: languageMap[language],
          stdin: tc.input,
        }
      );

      const { stdout, stderr, compile_output } = response.data;

      if (compile_output) {
        return res.json({
          results: [
            {
              input: tc.input,
              expected: tc.expected_output,
              output: "",
              passed: false,
              error: compile_output,
            },
          ],
        });
      }

      if (stderr) {
        return res.json({
          results: [
            {
              input: tc.input,
              expected: tc.expected_output,
              output: "",
              passed: false,
              error: stderr,
            },
          ],
        });
      }

      const actual = (stdout ?? "").trim();
      const expected = tc.expected_output.trim();

      results.push({
        input: tc.input,
        expected,
        output: actual,
        passed: actual === expected,
        error: null,
      });
    }

    return res.json({ results });
  } catch (err) {
    console.error("Judge0 Run Error:", err);
    return res.status(500).json({ error: "Execution failed" });
  }
};

/* =========================
   SUBMIT CODE
   ========================= */

export const submitCode = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { problemId, code, language } = req.body as {
      problemId: number;
      code: string;
      language: Language;
    };

    if (!languageMap[language]) {
      return res.status(400).json({ error: "Unsupported language" });
    }

    const { rows: testCases } = await pool.query(
      `
      SELECT input, expected_output
      FROM test_cases
      WHERE problem_id = $1
      ORDER BY id ASC
      `,
      [problemId]
    );

    const results = [];

    for (const tc of testCases) {
      const response = await axios.post<Judge0Response>(
        `${JUDGE0_URL}/submissions?wait=true`,
        {
          source_code: code,
          language_id: languageMap[language],
          stdin: tc.input,
        }
      );

      const { stdout, stderr, compile_output } = response.data;

      if (compile_output) {
        return res.json({
          results: [
            {
              input: tc.input,
              expected: tc.expected_output,
              output: "",
              passed: false,
              error: compile_output,
            },
          ],
        });
      }

      if (stderr) {
        return res.json({
          results: [
            {
              input: tc.input,
              expected: tc.expected_output,
              output: "",
              passed: false,
              error: stderr,
            },
          ],
        });
      }

      const actual = (stdout ?? "").trim();
      const expected = tc.expected_output.trim();

      results.push({
        input: tc.input,
        expected,
        output: actual,
        passed: actual === expected,
        error: null,
      });
    }

    return res.json({ results });
  } catch (err) {
    console.error("Judge0 Submit Error:", err);
    return res.status(500).json({ error: "Submission failed" });
  }
};
