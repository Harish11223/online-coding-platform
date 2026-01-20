import { Router } from "express";
import { pool } from "../db/index.js";

const router = Router();

router.get("/db-test", async (_req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json(result.rows[0]);
});

export default router;
