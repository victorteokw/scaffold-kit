import Context from './Context';
import Executable from './Executable';
import ExecutionInfo from './ExecutionInfo';
import flushContext from './flushContext';
import nullExecutable from './nullExecutable';

async function execute(executable: Executable, executionInfo: ExecutionInfo) {
  const context = new Context(executionInfo);
  await executable(context, nullExecutable);
  await flushContext(context);
}

export default execute;
