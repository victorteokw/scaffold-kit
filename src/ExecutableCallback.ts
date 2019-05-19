import Context from "./Context";

type ExecutableCallback = (ctx: Context) => Promise<void> | void;

export default ExecutableCallback;
