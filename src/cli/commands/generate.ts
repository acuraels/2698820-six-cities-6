import { resolve } from 'node:path';
import chalk from 'chalk';
import { writeLinesToFile } from '../services/file-writer.js';
import { fetchMockServerData } from '../services/mock-server.js';
import { createOfferTsvRow } from '../utils/offer-tsv.js';

export const runGenerate = async (countRaw?: string, filepath?: string, url?: string): Promise<void> => {
  if (!countRaw || !filepath || !url) {
    console.error(chalk.red('Ошибка: для --generate нужно передать <n> <filepath> <url>.'));
    console.log(chalk.yellow('Пример: npm run cli -- --generate 50 ./mocks/generated.tsv http://localhost:3123/mockData'));
    process.exitCode = 1;
    return;
  }

  const count = Number(countRaw);
  if (!Number.isInteger(count) || count <= 0) {
    console.error(chalk.red('Ошибка: параметр <n> должен быть целым числом больше 0.'));
    process.exitCode = 1;
    return;
  }

  const absolutePath = resolve(filepath);

  try {
    const mockData = await fetchMockServerData(url);
    await writeLinesToFile(count, absolutePath, () => createOfferTsvRow(mockData));
    console.log(chalk.green(`Файл успешно создан: ${absolutePath}`));
    console.log(chalk.yellow(`Сгенерировано строк: ${count}`));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
    console.error(chalk.red(`Ошибка генерации: ${message}`));
    process.exitCode = 1;
  }
};
