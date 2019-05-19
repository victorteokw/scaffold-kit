import Context from "./Context";

type Executable = (ctx: Context, next: Executable) => Promise<void> | void;

export default Executable;
