export interface PackageManager {
	install(projectPath: string): Promise<boolean>
	build(projectPath: string): Promise<boolean>
}
