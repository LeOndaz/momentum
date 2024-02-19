import { initEslint } from './initEslint';
import { PackageManager } from '../../typing/packageMangers';

interface InitArgs {
  typescript: boolean;
  eslint: boolean;
  manager: PackageManager;
  projectRoot: string;
}

const init = async ({
                      manager,
                      projectRoot,
                      eslint,
                      typescript,
                    }: InitArgs) => {

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
};

export {
  init,
};