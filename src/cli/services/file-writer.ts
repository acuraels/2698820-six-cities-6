import { once } from 'node:events';
import { createWriteStream } from 'node:fs';

export const writeLinesToFile = async (linesCount: number, outputPath: string, rowFactory: () => string): Promise<void> => {
  const stream = createWriteStream(outputPath, { encoding: 'utf8' });

  for (let i = 0; i < linesCount; i++) {
    const line = `${rowFactory()}\n`;
    if (!stream.write(line)) {
      await once(stream, 'drain');
    }
  }

  stream.end();
  await Promise.race([
    once(stream, 'finish'),
    once(stream, 'error').then(([error]) => Promise.reject(error as Error))
  ]);
};
