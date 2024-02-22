import { showError } from "./utils/toasts";
import { ProjectCommand } from "./utils/projectCommand";
import { NodePackageManager } from "./typing/packageMangers";

export default ProjectCommand<Preferences.ProjectVite, Arguments.ProjectVite, NodePackageManager>(async (opts) => {
  const { manager } = opts;
  const { projectName, template } = opts.args;
  const { projectsLocation } = opts.preferences;

  try {
    await manager.create({
      template,
      using: "vite",
      projectName: projectName,
      root: projectsLocation, // not root, the root will be created because of create command
    });
  } catch (e) {
    console.error(e);
    await showError(`failed to create project with vite, template=${template}`);
    return;
  }
});
