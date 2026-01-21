import { exec } from "child_process";
import fs from "fs";
import path from "path";

export const runUserCode = ({ sourceCode, input, language }: any) => {
  return new Promise<{ output: string; error?: string }>((resolve) => {
    const tempFile = path.join(__dirname, "temp.js");

    fs.writeFileSync(
      tempFile,
      `
${sourceCode}
console.log(solution(${input.split("\n").join(",")}));
`
    );

    exec(`node ${tempFile}`, (error, stdout, stderr) => {
      if (error || stderr) {
        resolve({ output: "", error: stderr || error?.message });
      } else {
        resolve({ output: stdout.trim() });
      }
    });
  });
};
