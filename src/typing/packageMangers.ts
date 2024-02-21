import { Shell } from 'zx';

export type NodePackageManagerName = 'npm' | 'yarn' | 'bun' | 'pnpm';
export type PythonPackageManager = 'poetry' | 'pip';
export type GoPackageManager = 'go';

export interface ProjectInstallOpts {
  root: string;
  packageName: string;
  dev?: boolean;
  global?: boolean;
}

export interface ProjectInitOpts {
  root: string;
}

export interface NodeProjectCreateOpts {
  using: string;
  projectName: string
  root: string
  template: string;
}

export interface PackageManager<InstallOpts extends ProjectInstallOpts = ProjectInstallOpts, InitOpts extends ProjectInitOpts = ProjectInitOpts> {
  name: string;

  install: (opts: InstallOpts) => Promise<void>;
  init: (opts: InitOpts) => Promise<void>;
  isInstalled: () => Promise<boolean>;
  underlyingShell?: Shell;
}

export interface NodePackageManager extends PackageManager {
  name: NodePackageManagerName;
  create: (opts: NodeProjectCreateOpts) => Promise<void>;
}

export interface PackageManagerSpecs {
  installCommand?: 'install' | 'add';
  initCommand?: 'init'; // FIXME: if this comment stays, most likely no package manager had anything other than init

  globalFlag?: string;
  devFlag?: string; 
}

export interface NodePackageManagerSpecs  extends PackageManagerSpecs{
  createCommand?: 'create'
}

export type PackageManagerName =  NodePackageManagerName | GoPackageManager | PythonPackageManager;