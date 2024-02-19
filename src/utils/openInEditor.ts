import { $ } from './shell';
import { showHUD } from '@raycast/api';

export const openEditor = async (path: string, editor: string) => {
  // in a better scenario, I would dynamically show a dropdown of all registered apps and let him choose
  // but preferences are hardcoded for now.

  try {
    await $`${editor} ${path}`.then(() => showHUD('have fun hacking'));
  } catch (e) {
    console.error(e);
    throw new Error(`failed to open path:${path} in ${editor}`);
  }
};