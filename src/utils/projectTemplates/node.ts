import { ProjectTemplate } from "../../typing/projectTemplate";

const initProject = (args: Arguments.NodeProject, prefs: Preferences.NodeProject) => {
    console.log(args);
    console.log(prefs.);
}

export const node: ProjectTemplate<Arguments.NodeProject, Preferences.NodeProject> = {
    initProject,
}