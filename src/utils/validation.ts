import { $ } from './shell';
import path from 'node:path';
import { makeDirIfNotExists } from './ensureExistingDir';
import { PackageManager, PackageManagerName } from '../typing/packageMangers';
import { getManagerByName } from './packageManagers';
import { openEditor } from './openInEditor';
import { ValidationError } from './errors';
import { open } from '@raycast/api';

export interface ValidPrefsResult {
  manager: PackageManager;
  projectRoot: string;
  openEditor: () => Promise<void>;
}

export const validateProjectRoot = async (root: string, projectDir: string) => {
  const projectRoot = path.join(root, projectDir);

  await makeDirIfNotExists(root);
  await makeDirIfNotExists(projectRoot);

  return projectRoot;
};


export const validateManager = async (pkgManager: PackageManagerName) => {
  const manager = getManagerByName(pkgManager);
  const packageManagerIsInstalled = await manager.isInstalled();

  if (!packageManagerIsInstalled) {
    throw new ValidationError(`${pkgManager} is not installed`);
  }

  return manager;
};


export const validatePrefs = async (prefs: Preferences.ProjectEmpty, args: Arguments.ProjectNode): Promise<ValidPrefsResult> => {
  const projectRoot = await validateProjectRoot(prefs.projectsLocation, args.projectName);
  const manager = await validateManager(prefs.pkgManager);
  const editor = async () => {
    await open(projectRoot, prefs.editor);
  };

  return {
    manager,
    projectRoot,
    openEditor: editor,
  };
};