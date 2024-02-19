

export const getExecutorFromPkgManager = (pkgManager: string) => {
  switch (pkgManager) {
  case 'npm':
    return 'npx';
  case 'yarn':
    return 'yarn';
  case 'pnpm':
    return 'pnpm dlx';
  case 'bun':
    return 'bunx';
  default:
    return 'npm';
  }
};