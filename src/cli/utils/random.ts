export const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

export const getRandomFloat = (min: number, max: number, precision: number): number => {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(precision));
};

export const getRandomArrayItem = <T>(items: readonly T[]): T => items[getRandomInt(0, items.length - 1)];

export const getRandomSubset = <T>(items: readonly T[], min: number, max: number): T[] => {
  const length = getRandomInt(min, Math.min(max, items.length));
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, length);
};

export const getRandomDate = (): string => {
  const now = Date.now();
  const twoYearsAgo = now - 1000 * 60 * 60 * 24 * 365 * 2;
  const randomTimestamp = getRandomInt(twoYearsAgo, now);
  return new Date(randomTimestamp).toISOString();
};
