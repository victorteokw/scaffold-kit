interface UpdateFileInfo {
  updator: (original: string) => string;
  rollbacker: (original: string) => string;
  at: string;
}

export default UpdateFileInfo;
