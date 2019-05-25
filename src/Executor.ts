import Instruction from "./Instruction";
import Handler from './Handler';

class Executor {

  public instructions: Instruction[];
  private handlers: { [key: string]: Handler };

  constructor() {
    this.instructions = [];
    this.handlers = {};
  }

  public push(instruction: Instruction): Executor {
    this.instructions.push(instruction);
    return this;
  }

}

export default Executor;
