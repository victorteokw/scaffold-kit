interface InstallDependencyInfo {
  package: string;
  version: string;
  dev?: boolean;
  mock?: boolean;
}

export default InstallDependencyInfo;
