export interface PackageManager {
	installDependencies(projectPath: string): Promise<boolean>
	buildProject(projectPath: string): Promise<boolean>
}
