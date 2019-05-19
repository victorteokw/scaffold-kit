import PlugableCallback from "./PlugableCallback";

type Plugable<T> = (ctx: T, next: PlugableCallback<T>) => Promise<void> | void;

export default Plugable;
