import { Request, Response } from "express";
import { pool } from "../db/index.js";

/* =========================
   GET ALL PROBLEMS
   ========================= */
export const getProblems = async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, title, difficulty
      FROM problems
      ORDER BY id ASC
    `);

    res.json(rows);
  } catch (err) {
    console.error("Error fetching problems:", err);
    res.status(500).json({ error: "Failed to fetch problems" });
  }
};

/* =========================
   GET PROBLEM BY ID
   ========================= */
export const getProblemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(
      `
      SELECT
        id,
        title,
        description,
        constraints,
        difficulty,
        examples
      FROM problems
      WHERE id = $1
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Problem not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching problem:", err);
    res.status(500).json({ error: "Failed to fetch problem" });
  }
};

/* =========================
   GET PROBLEM TEST CASES
   ========================= */
/**
 * GET /api/problems/:problemId/testcases
 * Returns ONLY visible test case inputs
 */
export const getProblemTestCases = async (
  req: Request,
  res: Response
) => {
  try {
    const { problemId } = req.params;

    const { rows } = await pool.query(
      `
      SELECT id, input
      FROM test_cases
      WHERE problem_id = $1
        AND is_hidden = false
      ORDER BY id ASC
      `,
      [problemId]
    );

    res.json({
      testCases: rows,
    });
  } catch (err) {
    console.error("Error fetching test cases:", err);
    res.status(500).json({
      error: "Failed to fetch test cases",
    });
  }
};
