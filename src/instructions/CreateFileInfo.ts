interface CCreateFileInfo {
  from: undefined;
  content: string;
  at: string;
  context?: object;
  overwrite?: boolean;
}

interface FCreateFileInfo {
  from: string;
  content: undefined;
  at: string;
  context?: object;
  overwrite?: boolean;
}

type CreateFileInfo = CCreateFileInfo | FCreateFileInfo;

export default CreateFileInfo;
