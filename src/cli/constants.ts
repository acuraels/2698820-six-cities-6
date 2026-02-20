import { type CityName } from '../types/entities.js';

export const HELP_TEXT = `
Программа для подготовки данных для REST API сервера.

Пример:
  main.js --<command> [--arguments]

Команды:
  --help                             Печатает этот текст
  --version                          Выводит номер версии приложения
  --import <path>                    Импортирует данные из TSV файла
  --generate <n> <path> <url>        Генерирует тестовые данные
`;

export const TSV_COLUMNS_COUNT = 19;
export const RATING_PRECISION = 1;

export const CITY_LOCATION: Record<CityName, { latitude: number; longitude: number }> = {
  Paris: { latitude: 48.85661, longitude: 2.351499 },
  Cologne: { latitude: 50.938361, longitude: 6.959974 },
  Brussels: { latitude: 50.846557, longitude: 4.351697 },
  Amsterdam: { latitude: 52.370216, longitude: 4.895168 },
  Hamburg: { latitude: 53.550341, longitude: 10.000654 },
  Dusseldorf: { latitude: 51.225402, longitude: 6.776314 }
};
