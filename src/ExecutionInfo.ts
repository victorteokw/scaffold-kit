import Options from "./Options";

interface ExecutionInfo {
  wd: string,
  args: string[],
  options: Options
}

export default ExecutionInfo;
