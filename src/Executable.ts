import Context from "./Context";
import ExecutableCallback from "./ExecutableCallback";

type Executable = (ctx: Context, next: ExecutableCallback) => Promise<void> | void;

export default Executable;
