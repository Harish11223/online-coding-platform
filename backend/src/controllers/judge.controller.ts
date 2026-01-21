import axios from "axios";
import { Request, Response } from "express";
import { pool } from "../db/index.js";

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
   Judge0 Config
   ========================= */

const JUDGE0_URL = process.env.JUDGE0_URL as string;

/* =========================
   Helpers
   ========================= */

/**
 * 🔥 JSON → stdin (FINAL FIX)
 * Entire input is passed as JSON string
 */
function jsonToStdin(inputJson: any): string {
  return JSON.stringify(inputJson);
}

/**
 * Normalize outputs for comparison
 * - "0 1"   → [0,1]
 * - "[0,1]" → [0,1]
 * - Scalars → string
 */
function normalize(value: string) {
  const v = value.trim();

  // Space separated numbers → array
  if (/^\d+(\s+\d+)+$/.test(v)) {
    return JSON.stringify(v.split(/\s+/).map(Number));
  }

  try {
    return JSON.stringify(JSON.parse(v));
  } catch {
    return JSON.stringify(v);
  }
}

/* =========================
   Shared Judge Logic
   ========================= */

async function executeAgainstTestCases(
  problemId: number,
  code: string,
  language: Language,
  includeHidden: boolean
) {
  const { rows: testCases } = await pool.query(
    `
    SELECT input_json, expected_output
    FROM test_cases
    WHERE problem_id = $1
      ${includeHidden ? "" : "AND is_hidden = false"}
    ORDER BY id ASC
    `,
    [problemId]
  );

  if (testCases.length === 0) {
    throw new Error("No test cases found");
  }

  const cases: {
    input: any;
    expected: string;
    output: string;
    passed: boolean;
  }[] = [];

  for (const tc of testCases) {
    const stdin = jsonToStdin(tc.input_json);

    const response = await axios.post(
      `${JUDGE0_URL}/submissions?wait=true`,
      {
        language_id: languageMap[language],
        source_code: code,
        stdin,
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      }
    );

    const { stdout, stderr, compile_output } = response.data;

    /* =========================
       Compile Error
       ========================= */
    if (compile_output) {
      return {
        status: "Compile Error",
        runtime: "N/A",
        cases: [
          {
            input: tc.input_json,
            expected: tc.expected_output,
            output: compile_output,
            passed: false,
          },
        ],
      };
    }

    /* =========================
       Runtime Error
       ========================= */
    if (stderr) {
      return {
        status: "Runtime Error",
        runtime: "N/A",
        cases: [
          {
            input: tc.input_json,
            expected: tc.expected_output,
            output: stderr,
            passed: false,
          },
        ],
      };
    }

    /* =========================
       Output Comparison
       ========================= */

    const rawOutput = (stdout ?? "").trim();
    const rawExpected = tc.expected_output.trim();

    const normalizedOutput = normalize(rawOutput);
    const normalizedExpected = normalize(rawExpected);

    const passed = normalizedOutput === normalizedExpected;

    cases.push({
      input: tc.input_json,
      expected: rawExpected,
      output: rawOutput,
      passed,
    });
  }

  const allPassed = cases.every((c) => c.passed);

  return {
    status: allPassed ? "Accepted" : "Wrong Answer",
    runtime: "N/A",
    cases,
  };
}

/* =========================
   RUN CODE
   ========================= */

export const runCode = async (req: Request, res: Response) => {
  try {
    const { problemId, code, language } = req.body;

    if (!problemId || !code || !language) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const result = await executeAgainstTestCases(
      problemId,
      code,
      language,
      false
    );

    return res.json(result);
  } catch (err: any) {
    console.error("❌ Judge Run Error:", err);
    return res.status(500).json({ error: err.message });
  }
};

/* =========================
   SUBMIT CODE
   ========================= */

export const submitCode = async (req: Request, res: Response) => {
  try {
    const { problemId, code, language } = req.body;

    if (!problemId || !code || !language) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const result = await executeAgainstTestCases(
      problemId,
      code,
      language,
      true
    );

    return res.json(result);
  } catch (err: any) {
    console.error("❌ Judge Submit Error:", err);
    return res.status(500).json({ error: err.message });
  }
};
