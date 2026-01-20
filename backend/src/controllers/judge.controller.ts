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

    // 🔹 Fetch ONLY public test cases (or all for now)
    const { rows: testCases } = await pool.query(
      `SELECT input, expected_output
       FROM test_cases
       WHERE problem_id = $1
       ORDER BY id ASC`,
      [problemId]
    );

    if (testCases.length === 0) {
      return res.status(404).json({ error: "No test cases found" });
    }

    const cases: {
      caseNo: number;
      input: string;
      expected: string;
      actual: string;
      status: "Passed" | "Failed";
    }[] = [];

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];

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
          verdict: "Compile Error",
          error: compile_output,
        });
      }

      if (stderr) {
        return res.json({
          verdict: "Runtime Error",
          error: stderr,
        });
      }

      const actual = (stdout ?? "").trim();
      const expected = tc.expected_output.trim();

      const status: "Passed" | "Failed" =
        actual === expected ? "Passed" : "Failed";

      cases.push({
        caseNo: i + 1,
        input: tc.input,
        expected,
        actual,
        status,
      });
    }

    // ✅ Run DOES NOT stop on failure
    return res.json({
      verdict: cases.every(c => c.status === "Passed")
        ? "Accepted"
        : "Wrong Answer",
      cases,
    });
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

    // 1️⃣ Fetch test cases
    const { rows: testCases } = await pool.query(
      `SELECT input, expected_output
       FROM test_cases
       WHERE problem_id = $1
       ORDER BY id ASC`,
      [problemId]
    );

    if (testCases.length === 0) {
      return res.status(404).json({ error: "No test cases found" });
    }

    const cases: {
      caseNo: number;
      input: string;
      expected: string;
      actual: string;
      status: "Passed" | "Failed";
    }[] = [];

    // 2️⃣ Run for each test case
    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];

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
          verdict: "Compile Error",
          error: compile_output,
        });
      }

      if (stderr) {
        return res.json({
          verdict: "Runtime Error",
          error: stderr,
        });
      }

      const actual = (stdout ?? "").trim();
      const expected = tc.expected_output.trim();

      const status: "Passed" | "Failed" =
        actual === expected ? "Passed" : "Failed";

      cases.push({
        caseNo: i + 1,
        input: tc.input,
        expected,
        actual,
        status,
      });

      if (status === "Failed") {
        return res.json({
          verdict: "Wrong Answer",
          cases,
        });
      }
    }

    // ✅ Accepted
    return res.json({
      verdict: "Accepted",
      cases,
    });
  } catch (err) {
    console.error("Judge0 Submit Error:", err);
    return res.status(500).json({ error: "Submission failed" });
  }
};
