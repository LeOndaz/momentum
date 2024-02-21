import path from 'node:path';
import { makeDirIfNotExists } from './makeDirIfNotExists';
import {
  NodePackageManager,
  NodePackageManagerSpecs,
  PackageManager,
  PackageManagerName,
} from '../typing/packageMangers';
import { getManagerByName } from './packageManagers';
import { ValidationError } from './errors';
import { getPreferenceValues, open } from '@raycast/api';

export interface ValidPrefsResult<T, PM extends PackageManager> {
  manager: PM;
  projectRoot: string;
  openEditor: () => Promise<void>;
  data: T;
}

export const validateProjectRoot = async (root: string, projectDir: string) => {
  const projectRoot = path.join(root, projectDir);

  await makeDirIfNotExists(root);
  await makeDirIfNotExists(projectRoot);

  return projectRoot;
};


export const validateManager = async (pkgManager: PackageManagerName) => {
  const manager = getManagerByName(pkgManager);
  
  if (!manager) {
    throw new ValidationError(`${pkgManager} is not supported`);
  }

  const packageManagerIsInstalled = await manager.isInstalled();

  if (!packageManagerIsInstalled) {
    throw new ValidationError(`${pkgManager} is not installed`);
  }

  return manager;
};


export const validatePrefs = async <
  T extends Preferences.ProjectEmpty,
  PM extends PackageManager
>(args: Arguments.ProjectEmpty): Promise<ValidPrefsResult<T, PM>> => {
  const prefs = getPreferenceValues<T>();

  const projectRoot = await validateProjectRoot(prefs.projectsLocation, args.projectName);
  const manager = await validateManager(prefs.pkgManager);

  const editor = async () => {
    await open(projectRoot, prefs.editor);
  };

  return {
    manager,
    projectRoot,
    openEditor: editor,
    data: prefs,
  };
};