import axios from 'axios';
import { type MockServerData } from '../types.js';

const validateMockServerData = (data: unknown): MockServerData => {
  if (!data || typeof data !== 'object') {
    throw new Error('Неверный формат mock-данных');
  }

  const record = data as Record<string, unknown>;
  const requiredFields: (keyof MockServerData)[] = [
    'titles',
    'descriptions',
    'previewImages',
    'images',
    'userNames',
    'userEmails'
  ];

  for (const field of requiredFields) {
    const value = record[field];
    if (!Array.isArray(value) || value.length === 0 || !value.every((item) => typeof item === 'string' && item.length > 0)) {
      throw new Error(`Поле "${field}" отсутствует или имеет неверный формат`);
    }
  }

  return record as MockServerData;
};

export const fetchMockServerData = async (url: string): Promise<MockServerData> => {
  try {
    const response = await axios.get(url, { timeout: 10_000 });
    return validateMockServerData(response.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
    throw new Error(`Не удалось получить данные от ${url}: ${message}`);
  }
};
