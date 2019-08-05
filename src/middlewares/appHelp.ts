import Executable from "../Executable";
import chalk from 'chalk';

interface AppHelpInfo {
  displayName: string,
  commandName: string,
  usage?: string,
  description: string,
  version: string
}

const appHelp = (info: AppHelpInfo): Executable => {
  return async (ctx, next) => {
    const descSection = ctx.helpSections.find((s) => s.key === 'desc');
    const usageSection = ctx.helpSections.find((s) => s.key === 'usage');
    if (descSection) {
      descSection.title = info.displayName + ' ' + info.version;
      descSection.content = info.description;
    } else {
      ctx.helpSections.unshift({
        key: 'desc',
        title: info.displayName + ' ' + info.version,
        content: info.description
      });
    }
    if (usageSection) {
      usageSection.title = 'Usage';
      usageSection.content = info.usage || `${info.commandName} ${chalk.italic('command')} [options...]`
    } else {
      ctx.helpSections.push({
        key: 'usage',
        title: 'Usage',
        content: info.usage || `${info.commandName} ${chalk.italic('command')} [options...]`
      });
    }
    await next(ctx);
  }
}

export default appHelp;
