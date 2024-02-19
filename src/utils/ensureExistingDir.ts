import fs from 'fs/promises';
import { ValidationError } from './errors';

export const makeDirIfNotExists = async (path: string): Promise<void> => {
  const stat = await fs.stat(path).catch(() => null);

  if (!stat) {
    try {
      await fs.mkdir(path);
    } catch (e) {
      console.log(e);
      throw new ValidationError(`failed to create ${path}`);
    }
  }
};
