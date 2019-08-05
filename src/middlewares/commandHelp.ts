import Executable from "../Executable";

interface CommandHelpInfo {
  appCommandName: string,
  commandName: string,
  usage?: string,
  description: string
}

const commandHelp = (info: CommandHelpInfo): Executable => {
  return async (ctx, next) => {
    const descSection = ctx.helpSections.find((s) => s.key === 'desc');
    const usageSection = ctx.helpSections.find((s) => s.key === 'usage');
    const commandSection = ctx.helpSections.find((s) => s.key === 'command');

    if (usageSection) {
      usageSection.title = 'Usage';
      usageSection.content = info.usage || `${info.appCommandName} ${info.commandName} [options...]`
    } else {
      ctx.helpSections.push({
        key: 'usage',
        title: 'Usage',
        content: info.usage || `${info.appCommandName} ${info.commandName} [options...]`
      });
    }
    if (commandSection) {
      commandSection.title = 'Command: ' + info.commandName;
      commandSection.content = info.description;
    } else {
      if (descSection) {
        const descSectionIndex = ctx.helpSections.indexOf(descSection);
        ctx.helpSections.splice(descSectionIndex + 1, 0, {
          key: 'command',
          title: 'Command: ' + info.commandName,
          content: info.description
        });
      } else {
        ctx.helpSections.unshift({
          key: 'command',
          title: 'Command: ' + info.commandName,
          content: info.description
        });
      }
    }
    await next(ctx);
  }
}

export default commandHelp;
