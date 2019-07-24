import * as _ from 'lodash';
import Instruction from './Instruction';

const reverseInsts = {
  'appendFile': 'detachFromFile',
  'createFile': 'deleteFile',
  'installDependency': 'removeDependency',
  'runShellCommand': 'undoShellCommand',
  'updateFile': 'rollbackFile',
  'updateJSONFile': 'rollbackJSONFile'
};

function equal<T>(value: any) {
  return (v: T) => v === value;
};

const findReverseInst = (name: string) => {
  return reverseInsts[name] || _.findKey(reverseInsts, equal(name)) || name;
};

const reverseInstruction = (instruction: Instruction) => {
  return {
    detail: instruction.detail,
    type: findReverseInst(instruction.type)
  };
};

export default reverseInstruction;
