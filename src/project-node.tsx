import type { LaunchProps } from '@raycast/api';
import { getPreferenceValues } from '@raycast/api';
import { validatePrefs, ValidPrefsResult } from './utils/validation';
import { node } from './apis/node';
import { showError } from './utils/toasts';
import { isValidationError } from './utils/errors';

interface CommandProps extends LaunchProps {
  arguments: Arguments.ProjectNode;
}

export default async function Command(props: CommandProps) {
  const preferences = getPreferenceValues<Preferences.ProjectNode>();
  let data: ValidPrefsResult;

  try {
    data = await validatePrefs(preferences, props.arguments);
  } catch (err) {
    if (isValidationError(err)) {
      await showError(err.message);
    }

    console.error(err);
    return;
  }

  const { manager, projectRoot, openEditor } = data;

  if (preferences.showEditorFirst) {
    await openEditor();
  }

  try {
    await node.init({
      manager,
      typescript: preferences.typescript,
      eslint: preferences.eslint,
      projectRoot,
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
}
