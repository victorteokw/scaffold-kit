let instructions = [];

const instRegistry = {
  push(name, params) {
    instructions.push({ name, params });
  },
  replaceAll(newInstructions) {
    instructions = newInstructions;
  },
  getAll() {
    return instructions;
  }
};

module.exports = instRegistry;
