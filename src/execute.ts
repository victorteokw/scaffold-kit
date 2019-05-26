import Context from './Context';
import Executable from './Executable';
import ExecutionInfo from './ExecutionInfo';
import nullExecutable from './nullExecutable';
import Reporter from './Reporter';

async function execute(
  executable: Executable,
  executionInfo: ExecutionInfo,
  reporter?: Reporter
) {
  const context = new Context(executionInfo);
  if (reporter) context.reporter = reporter;
  await executable(context, nullExecutable);
  await context.executor.flush(context.reporter);
}

export default execute;
