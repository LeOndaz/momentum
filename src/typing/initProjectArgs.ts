import { NodePackageManager, PackageManager } from './packageMangers';

type EslintPreset = 'eslint' | 'author-recommended';


export interface BasePerformOpts {
  manager: PackageManager;
  projectRoot: string;
}

export interface BaseNodePerformOpts extends BasePerformOpts {
  manager: NodePackageManager;
}



export type InitNodeOpts = Preferences.ProjectNode & BaseNodePerformOpts;

export interface InitEslint {
  manager: PackageManager;
  root: string;
  preset?: EslintPreset;
  typescript?: boolean;
}

export type InitReactOpts = Preferences.ProjectReact & BaseNodePerformOpts;
