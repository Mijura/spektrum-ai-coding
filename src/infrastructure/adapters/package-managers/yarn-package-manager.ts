
import { FileSystemPort } from "@jigjoy-io/file-artifacts-storage"
import { PackageManager } from "../../ports/package-manager"
import { spawn } from "child_process"
import path from "path"

/**
 * Represents the result of a command execution
 */
export interface CommandResult {
	success: boolean
	stdout: string
	stderr: string
	exitCode: number
}

/**
 * Represents a package manager that can install and build projects
 */
export class YarnPackageManager implements PackageManager {

	constructor(private readonly fileSystem: FileSystemPort) {}

	private runCommand(command: string, cwd: string, contextMessage?: string): Promise<CommandResult> {
		return new Promise((resolve) => {
			const [cmd, ...args] = command.split(" ")
			const process = spawn(cmd, args, { cwd, stdio: "pipe", shell: true })
	
			let stdout = contextMessage ? `${contextMessage}\n` : ""
			let stderr = ""
	
			process.stdout?.on("data", (data) => {
				const output = data.toString()
				stdout += output
				console.log(output.trim()) // Real-time output
			})
	
			process.stderr?.on("data", (data) => {
				const errorOutput = data.toString()
				stderr += errorOutput
				console.error(errorOutput.trim()) // Real-time error logs
			})
	
			process.on("error", (error) => {
				stderr += `\nProcess error: ${error.message}`
			})
	
			process.on("close", (code) => {
				const success = code === 0
				const finalMessage = success
					? `✅ Command "${command}" executed successfully.`
					: `❌ Command "${command}" failed with exit code ${code}.`
	
				if (success) {
					stdout += `\n${finalMessage}`
				} else {
					stderr += `\n${finalMessage}`
				}
	
				resolve({
					success,
					stdout: stdout.trim(),
					stderr: stderr.trim(),
					exitCode: code ?? -1,
				})
			})
		})
	}

	async install(projectPath: string): Promise<boolean> {
		await this.fileSystem.ensureFile(path.join(projectPath, "yarn.lock"))
		const result = await this.runCommand("yarn install", projectPath, `Installing dependencies in ${projectPath}...`)
		console.log(JSON.stringify(result))
		if (!result.success) {
			console.error(result.stderr)
			throw new Error("Install dependencies failed: " + JSON.stringify(result))
		}
		return result.success
	}

	async build(projectPath: string): Promise<boolean> {
		const result = await this.runCommand("yarn build", projectPath, `Building project in ${projectPath}...`)
		console.log(JSON.stringify(result))
		if (!result.success) {
			console.error(result.stderr)
			throw new Error("Build failed: " + JSON.stringify(result))
		}
		return result.success
	}
}
