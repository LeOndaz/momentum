export interface ProjectTemplate<T, U extends Preferences> {
	initProject: (args: T, prefs: U) => void;
}