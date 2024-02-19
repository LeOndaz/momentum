#!/usr/bin.env zx
import {
  NodePackageManager,
  NodePackageManagerName,
  NodeProjectCreateOpts,
  PackageManager,
  PackageManagerName,
  PackageManagerSpecs,
  ProjectInitOpts,
  ProjectInstallOpts,
} from '../typing/packageMangers';
import { showToast, Toast } from '@raycast/api';
import { $ } from './shell';

const defaultSpecs: PackageManagerSpecs = {
  installCommand: 'install',
  initCommand: 'init',
  devFlag: '-D',
  globalFlag: '-g',
};

const packageManager = <InstallOpts extends ProjectInstallOpts, InitOpts extends ProjectInitOpts>(name: PackageManagerName, specs: PackageManagerSpecs = defaultSpecs): PackageManager<InstallOpts, InitOpts> => {
  const install = async ({ packageName, dev, root, global }: InstallOpts) => {
    await showToast(Toast.Style.Animated, 'installing', `${name} is installing at ${root}`);

    const command = [
      name,
      specs.installCommand || defaultSpecs.installCommand,
      packageName,
    ];
  
    // some combinations make no sense
    if (global && root) {
      throw new Error(`can't pass a directory for a global install`);
    }
    
    if (global && !specs.globalFlag) {
      throw new Error(`${name} does not support global installations`);
    }
    
    if (global && dev) {
      throw new Error(`can't install dev packages globally`);
    }

    if (dev && !specs.devFlag) {
      throw new Error(`${name} does not support dev installations`);
    }

    if (global) {
      command.push(specs.globalFlag || defaultSpecs.globalFlag);
    }

    // dev installs can't be global
    if (dev) {
      command.push(specs.devFlag || defaultSpecs.devFlag);
    }

    try {
      await $`cd ${root} && ${command}`;
    } catch (e) {
      console.error(e);
      throw new Error(`${name} failed to install ${packageName}`);
    }
  };

  const init = async ({
                        root,
                      }: InitOpts) => {


    try {
      await $`cd ${root} && ${name} ${specs.initCommand} -y`;
    } catch (e) {
      console.error(e);
      throw new Error(`${name} ${specs.initCommand} has failed`);
    }
  };

  const isInstalled = async () => {
    try {
      await $`which ${name}`;
      return true;
    } catch {
      return false;
    }
  };


  return {
    name,
    init,
    install,
    isInstalled,
  };
};

const defaultNodeSpecs = {
  ...defaultSpecs,
  createCommand: 'create',
};

const nodePackageManager = (name: NodePackageManagerName, specs: PackageManagerSpecs & {
  createCommand?: string
} = defaultNodeSpecs): NodePackageManager => {
  const manager = packageManager(name, specs);

  const create = async ({
                          projectName,
                          root,
                          template,
                        }: NodeProjectCreateOpts) => {
    const command = [
      name,
      specs.createCommand,
      projectName,
      template,
    ];

    try {
      await $`cd ${root} && ${command}`;
    } catch (e) {
      console.error(e);
      throw new Error(`${name} failed to create project ${root}/${projectName}`);
    }
  };

  return {
    ...manager,
    name,
    create,
  };
};

export const bun = () => {
  return nodePackageManager('bun', {
    installCommand: 'add',
  });
};

export const pnpm = () => {
  return packageManager('pnpm', {
    installCommand: 'add',
  });
};
export const yarn = () => {
  return packageManager('yarn', {
    installCommand: 'add',
  });
};

export const npm = (): NodePackageManager => {
  const baseNpm = nodePackageManager('npm');

  return {
    ...baseNpm,
    create: async (opts: NodeProjectCreateOpts) => {
      return baseNpm.create({
        ...opts,
        template: `-- ${opts.template}`,
      });
    },
  };
};

export const poetry = () => {
  return packageManager('poetry', {
    devFlag: '--group dev',
  });
};

export const getManagerByName = (name: PackageManagerName) => {
  switch (name) {
    case 'pnpm':
      return pnpm();
    case 'npm':
      return npm();
    case 'yarn':
      return yarn();
    case 'bun':
      return bun();
    case 'poetry':
      return poetry();
    default:
      return npm();
  }
};