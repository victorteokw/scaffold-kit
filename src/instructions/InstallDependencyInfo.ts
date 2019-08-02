interface InstallDependencyInfo {
  package: string;
  version: string;
  dev?: boolean;
  mock?: boolean;
  wd?: string;
}

export default InstallDependencyInfo;
