interface JudgeResult {
  status: string;
  runtime: string;
  cases: {
    input: any;
    output: string;
    expected: string;
    passed: boolean;
  }[];
}
