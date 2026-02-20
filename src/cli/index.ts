import chalk from 'chalk';
import { runGenerate } from './commands/generate.js';
import { printHelp, printVersion } from './commands/help.js';
import { runImport } from './commands/import.js';

export const runCli = async (): Promise<void> => {
  const [command, ...args] = process.argv.slice(2);

  switch (command) {
    case undefined:
    case '--help':
      printHelp();
      break;
    case '--version':
      printVersion();
      break;
    case '--import':
      await runImport(args[0]);
      break;
    case '--generate':
      await runGenerate(args[0], args[1], args[2]);
      break;
    default:
      console.error(chalk.red(`Неизвестная команда: ${command}`));
      printHelp();
      process.exitCode = 1;
  }
};
