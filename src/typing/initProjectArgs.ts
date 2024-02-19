import { PackageManager } from './packageMangers';

type EslintPreset = 'eslint' | 'author-recommended';


export interface InitEslint {
  manager: PackageManager;
  root: string;
  preset?: EslintPreset;
  typescript?: boolean;
}