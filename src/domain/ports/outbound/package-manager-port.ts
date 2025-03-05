export interface PackageManagerPort {
	installDependencies(projectPath: string): Promise<boolean>
	buildProject(projectPath: string): Promise<boolean>
}
