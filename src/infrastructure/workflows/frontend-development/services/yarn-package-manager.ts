
import { PackageManager } from "../interfaces/package-manager"
import { runCommand } from "../utils/command-runner"

export class YarnPackageManager implements PackageManager {
	async installDependencies(projectPath: string): Promise<boolean> {
		const result = await runCommand("yarn install", projectPath, `Installing dependencies in ${projectPath}...`)
		console.log(result.stdout)
		if (!result.success) {
			console.error(result.stderr)
			throw new Error("Install dependencies failed: " + result.stderr)
		}
		return result.success
	}

	async buildProject(projectPath: string): Promise<boolean> {
		const result = await runCommand("yarn build", projectPath, `Building project in ${projectPath}...`)
		console.log(result.stdout)
		if (!result.success) {
			console.error(result.stderr)
			throw new Error("Build failed: " + result.stderr)
		}
		return result.success
	}
}
