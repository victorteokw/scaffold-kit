import Context from './Context';
import Executable from './Executable';
import ExecutionInfo from './ExecutionInfo';
import nullExecutable from './nullExecutable';

async function execute(executable: Executable, executionInfo: ExecutionInfo) {
  const context = new Context(executionInfo);
  await executable(context, nullExecutable);
  await context.executor.flush();
}

export default execute;
