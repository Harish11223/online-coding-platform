import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import judgeRoutes from "./routes/judge.routes.js";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("➡️", req.method, req.url);
  next();
});

app.use("/api", judgeRoutes);

console.log("✅ judge routes registered");
console.log("✅ app.ts loaded");

export default app;
