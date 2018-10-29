const parsingCommandLineArgs = require('./parsingCommandLineArgs');

const getUserCommandLineInput = (app, argv = process.argv) => {
  if (!app.userCommandLineInput) {
    const { command, options, args } = parsingCommandLineArgs(argv);
    app.userCommandLineInput = { command, options, args };
  }
  return app.userCommandLineInput;
};

module.exports = getUserCommandLineInput;
