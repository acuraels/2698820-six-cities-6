import { readFileSync } from 'node:fs';
import chalk from 'chalk';
import { HELP_TEXT } from '../constants.js';

const getAppVersion = (): string => {
  const packageJsonPath = new URL('../../../package.json', import.meta.url);
  const rawPackageJson = readFileSync(packageJsonPath, 'utf8');
  const packageJson = JSON.parse(rawPackageJson) as { version: string };

  return packageJson.version;
};

export const printHelp = (): void => {
  console.log(chalk.cyan(HELP_TEXT.trim()));
};

export const printVersion = (): void => {
  console.log(chalk.green(getAppVersion()));
};
