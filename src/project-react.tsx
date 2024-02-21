import { NodeProjectCommand } from './utils/projectCommand';
import { showError } from './utils/toasts';

export default NodeProjectCommand<
  Preferences.ProjectReact,
  Arguments.ProjectReact
>(async (opts) => {
  const { manager } = opts;
  const {projectName} = opts.args;
  const { typescript, projectsLocation } = opts.preferences;

  const template = typescript ? 'react-ts' : 'react';

  try {
    await manager.create({
      template,
      using: 'vite',
      projectName: projectName,
      root: projectsLocation, // not root, the root will be created because of create command
    });
  } catch (e) {
    console.error(e);
    await showError('failed to create react project with vite');
    return;
  }
});