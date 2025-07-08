
import { PackageManager } from "../interfaces/package-manager"
import { runCommand } from "../utils/command-runner"

export class YarnPackageManager implements PackageManager {
	async installDependencies(projectPath: string): Promise<boolean> {
		const result = await runCommand("yarn install", projectPath, `Installing dependencies in ${projectPath}...`)
		console.log(JSON.stringify(result))
		if (!result.success) {
			console.error(result.stderr)
			throw new Error("Install dependencies failed: " + JSON.stringify(result))
		}
		return result.success
	}

	async buildProject(projectPath: string): Promise<boolean> {
		const result = await runCommand("yarn build", projectPath, `Building project in ${projectPath}...`)
		console.log(JSON.stringify(result))
		if (!result.success) {
			console.error(result.stderr)
			throw new Error("Build failed: " + JSON.stringify(result))
		}
		return result.success
	}
}
