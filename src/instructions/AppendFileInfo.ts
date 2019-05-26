interface CAppendFileInfo {
  from?: undefined;
  content: string;
  at: string;
  context?: object;
}

interface FAppendFileInfo {
  from: string;
  content?: undefined;
  at: string;
  context?: object;
}

type AppendFileInfo = CAppendFileInfo | FAppendFileInfo;

export default AppendFileInfo;
