import fs from "fs-extra"
import path from "path"
import { spawn } from "child_process"
import { SourceCodeDto } from "../dto/project"

interface CommandResult {
	success: boolean
	stdout: string
	stderr: string
	exitCode: number
}

async function runCommand(command: string, cwd: string, contextMessage?: string): Promise<CommandResult> {
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

async function installDependencies(projectPath: string): Promise<CommandResult> {
	const result = await runCommand("yarn install", projectPath, `Installing dependencies in ${projectPath}...`)
	console.log(result.stdout)
	if (!result.success) {
		console.error(result.stderr)
	}
	return result
}

async function buildProject(projectPath: string): Promise<CommandResult> {
	const result = await runCommand("yarn build", projectPath, `Building project in ${projectPath}...`)
	console.log(result.stdout) 
	if (!result.success) {
		console.error(result.stderr)
	}
	return result
}

async function fetchFiles(projectId: string): Promise<SourceCodeDto> {
	const projectPath = path.join("projects", projectId)
	const sourceCode: SourceCodeDto = {}
	const blacklist = new Set(["yarn.lock", ".env.example"])

	function readDirectory(directory: string, relativePath = "") {
		const files = fs.readdirSync(directory)

		for (const file of files) {
			if (blacklist.has(file)) continue

			const filePath = path.join(directory, file)
			const fileRelativePath = path.join(relativePath, file)
			const stat = fs.statSync(filePath)

			if (stat.isDirectory()) {
				if (file !== "node_modules" && file !== "dist") {
					readDirectory(filePath, fileRelativePath)
				}
			} else {
				sourceCode[fileRelativePath] = {
					code: fs.readFileSync(filePath, "utf8"),
				}
			}
		}
	}

	readDirectory(projectPath)

	return sourceCode
}

async function rebuildProject(projectId: string): Promise<void> {
	const projectPath = path.join("projects", projectId)

	try {
		await installDependencies(projectPath)
		await buildProject(projectPath)
	} catch (error) {
		console.error("Error updating project source code:", error)
		throw error
	}
}

export { fetchFiles, buildProject, rebuildProject, installDependencies }
