import "dotenv/config";
import app from "./app.js";

const PORT: number = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
