export interface Problem {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface TestResult {
  input: string;
  expected: string;
  output: string;
  passed: boolean;
  error?: string | null;
}

export interface TestCase {
  id: number;
  input: {
    nums: number[];
    target: number;
  };
}
