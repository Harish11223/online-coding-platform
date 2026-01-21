import { Router } from "express";
import {
  getProblems,
  getProblemById,
  getProblemTestCases
} from "../controllers/problems.controller.js";

const router = Router();

router.get("/", getProblems);
router.get("/:id", getProblemById);
router.get("/:problemId/testcases", getProblemTestCases);

export default router;
