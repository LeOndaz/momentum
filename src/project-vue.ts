import { ProjectCommand } from "./utils/projectCommand";
import { showError } from "./utils/toasts";
import { NodePackageManager } from "./typing/packageMangers";

export default ProjectCommand<Preferences.ProjectReact, Arguments.ProjectReact, NodePackageManager>(async (opts) => {
  const { manager } = opts;
  const { projectName } = opts.args;
  const { typescript, projectsLocation } = opts.preferences;

  const template = typescript ? "vue-ts" : "vue";

  try {
    await manager.create({
      template,
      using: "vite",
      projectName: projectName,
      root: projectsLocation, // not root, the root will be created because of create command
    });
  } catch (e) {
    console.error(e);
    await showError("failed to create vue project with vite");
    return;
  }
});
