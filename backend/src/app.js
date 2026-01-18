import express from "express";
import cors from "cors";
import judgeRoutes from "./routes/judge.routes.js"

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("➡️", req.method, req.url);
  next();
});

app.use("/api", judgeRoutes);
console.log("✅ judge routes registered");
console.log("✅ app.js loaded");

export default app;