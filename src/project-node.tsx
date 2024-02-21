import { NodeProjectCommand } from './utils/projectCommand';
import { initEslint } from './utils/node/initEslint';


export default NodeProjectCommand<
  Preferences.ProjectNode,
  Arguments.ProjectNode
>(async (opts) => {
  const { manager, projectRoot, preferences } = opts;
  const { typescript, eslint } = preferences;

  await manager.init({
    root: projectRoot,
  });

  if (typescript) {
    await manager.install({
      packageName: 'typescript',
      root: projectRoot,
      dev: true,
    });
  }

  if (eslint) {
    await initEslint({
      manager,
      preset: 'author-recommended',
      root: projectRoot,
      typescript,
    });
  }
});