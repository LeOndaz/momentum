import { getPreferenceValues, type LaunchProps } from '@raycast/api';
import { validatePrefs, ValidPrefsResult } from './validation';
import { isValidationError } from './errors';
import { showError } from './toasts';
import { Arguments } from '../typing/misc';
import { NodePackageManager, PackageManager } from '../typing/packageMangers';

export interface PerformOpts<Prefs extends Preferences.ProjectEmpty, Args extends Arguments.ProjectEmpty, PM extends PackageManager> {
  projectRoot: string;
  manager: PM & PackageManager,
  preferences: Prefs,
  args: Args
}

export type PerformFunc<
  Prefs extends Preferences.ProjectEmpty,
  Args extends Arguments.ProjectEmpty,
  PM extends PackageManager
> = (opts: PerformOpts<Prefs, Args, PM>) => Promise<void>;

export type NodePerformFunc<
  Prefs extends Preferences.ProjectEmpty,
  Args extends Arguments.ProjectEmpty,
> = PerformFunc<Prefs, Args, NodePackageManager>;

// not sure why Pascal, I felt it's more intuitive for a noun+function to be named in Pascal
export const ProjectCommand = <
  Prefs extends Preferences.ProjectEmpty,
  Args extends Arguments,
  PM extends PackageManager,
>(perform: PerformFunc<Prefs, Args, PM>) => {
  return async (launchProps: LaunchProps<{ arguments: Args }>) => {

    const preferences = getPreferenceValues<Prefs>();
    let data: ValidPrefsResult<Prefs>;

    try {
      data = await validatePrefs<Prefs>(launchProps.arguments);
    } catch (err) {
      if (isValidationError(err)) {
        await showError(err.message);
      }

      return;
    }

    const { manager, projectRoot, openEditor } = data;

    if (preferences.showEditorFirst) {
      try {
        await openEditor();
      } catch (e) {
        console.error(e);
        await showError('failed to open editor... exiting');
        return;
      }
    }

    try {
      await perform({
        manager,
        projectRoot,
        preferences,
        args: launchProps.arguments,
      });
    } catch (e) {
      console.error(e);
      await showError('failed to init project');
      return;
    }

    try {
      await openEditor();
    } catch (e) {
      console.error(e);
      await showError('project was created but failed to open editor');
    }
  };
};

export const NodeProjectCommand = <
  Prefs extends Preferences.ProjectNode,
  Args extends Arguments
>(perform: NodePerformFunc<Prefs, Args>) => ProjectCommand<Prefs, Args, NodePackageManager>(perform);
