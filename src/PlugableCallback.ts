type PlugableCallback<T> = (ctx: T) => Promise<void> | void;

export default PlugableCallback;
