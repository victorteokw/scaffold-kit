interface CDetachFromFileInfo {
  from?: undefined;
  content: string;
  at: string;
  context?: object;
}

interface FDetachFromFileInfo {
  from: string;
  content?: undefined;
  at: string;
  context?: object;
}

type DetachFromFileInfo = CDetachFromFileInfo | FDetachFromFileInfo;

export default DetachFromFileInfo;
