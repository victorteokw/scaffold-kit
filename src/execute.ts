import Context from './Context';
import Executable from './Executable';
import ExecutionInfo from './ExecutionInfo';
import nullExecutable from './nullExecutable';
import Reporter from './Reporter';

function execute(
  executable: Executable,
  executionInfo: ExecutionInfo,
  reporter?: Reporter
): Promise<void>;

function execute(
  executable: Executable,
  context: Context
): Promise<void>;

async function execute(
  executable: Executable,
  executionInfo: ExecutionInfo | Context,
  reporter?: Reporter
) {
  let context: Context;
  if (executionInfo instanceof Context) {
    context = executionInfo;
  } else {
    context = new Context(executionInfo);
  }
  if (reporter) context.reporter = reporter;
  await executable(context, nullExecutable);
  if (!context.disableFlush) {
    await context.executor.flush(context.reporter);
  }
}

export default execute;
