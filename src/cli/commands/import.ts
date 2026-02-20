import { createReadStream, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createInterface } from 'node:readline';
import chalk from 'chalk';
import { parseOfferLine } from '../utils/offer-tsv.js';

export const runImport = async (filepath?: string): Promise<void> => {
  if (!filepath) {
    console.error(chalk.red('Ошибка: не указан путь к TSV файлу.'));
    console.log(chalk.yellow('Пример: npm run cli -- --import ./mocks/offers.tsv'));
    process.exitCode = 1;
    return;
  }

  const absolutePath = resolve(filepath);
  if (!existsSync(absolutePath)) {
    console.error(chalk.red(`Ошибка: файл не найден: ${absolutePath}`));
    process.exitCode = 1;
    return;
  }

  try {
    const stream = createReadStream(absolutePath, { encoding: 'utf8' });
    const reader = createInterface({
      input: stream,
      crlfDelay: Infinity
    });

    let importedCount = 0;

    for await (const line of reader) {
      const preparedLine = line.trim();
      if (!preparedLine) {
        continue;
      }

      parseOfferLine(preparedLine, importedCount + 1);
      importedCount++;
    }

    console.log(chalk.green(`Импорт успешно завершён: ${importedCount} предложений.`));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
    console.error(chalk.red(`Ошибка импорта: ${message}`));
    process.exitCode = 1;
  }
};
