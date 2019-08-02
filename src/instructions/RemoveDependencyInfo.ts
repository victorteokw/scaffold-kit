interface RemoveDependencyInfo {
  package: string;
  mock?: boolean;
  version?: string;
  dev?: boolean;
  wd?: string;
}

export default RemoveDependencyInfo;
