import axios from "axios";

const languageMap = {
  cpp: 54,
  java: 62,
  python: 71,
  javascript: 63,
};

// Use 'export' before the function definition
export const runCode = async (req, res) => {
  try {
    const { code, language, input } = req.body;

    const response = await axios.post(
      `${process.env.JUDGE0_URL}/submissions/?wait=true`,
      {
        source_code: code,
        language_id: languageMap[language],
        stdin: input,
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Judge0 Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Execution failed" });
  }
};