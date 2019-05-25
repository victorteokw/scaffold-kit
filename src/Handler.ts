import Reporter from "./Reporter";
import Render from "./Render";

type Handler = (
  params: { [key: string]: any },
  reporter: Reporter,
  render: Render
) => Promise<void> | void;

export default Handler;
