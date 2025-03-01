import fs from "fs-extra"
import path from "path"
import { exec } from "child_process"
import { ProjectDto, SourceCodeDto } from "../dto/project"
import { RspackCompiler } from "./compilers/rspack-compiler"

async function runCommand(command: string, cwd: string): Promise<void> {
	return new Promise((resolve, reject) => {
		exec(command, { cwd }, (error, stdout, stderr) => {
			if (error) {
				console.error(`Error running command: ${command}`)
				console.error(`Stderr: ${stderr}`)
				reject(error)
				return
			}
			console.log(`Stdout: ${stdout}`)
			resolve()
		})
	})
}

async function installDependencies(projectPath: string): Promise<void> {
	console.log(`Installing dependencies in ${projectPath}...`)
	await runCommand("yarn install", projectPath)
	console.log("Dependencies installed successfully.")
}

async function buildProject(projectPath: string): Promise<void> {
	console.log(`Building project in ${projectPath}...`)
	await runCommand("yarn build", projectPath)
	console.log("Project built successfully.")
}

async function getSourceCode(projectId: string): Promise<SourceCodeDto> {
	const projectPath = path.join("projects", projectId)
	const sourceCode: SourceCodeDto = {}
    const blacklist = new Set(['yarn.lock', '.env.example']);

	function readDirectory(directory: string, relativePath = "") {
		const files = fs.readdirSync(directory)

		for (const file of files) {


            if (blacklist.has(file)) continue;

			const filePath = path.join(directory, file)
			const fileRelativePath = path.join(relativePath, file)
			const stat = fs.statSync(filePath)

			if (stat.isDirectory()) {
				if (file !== "node_modules" && file !== "dist") {
					readDirectory(filePath, fileRelativePath)
				}
			} else {
				sourceCode[fileRelativePath] = {
					code: fs.readFileSync(filePath, "utf8")
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

export { getSourceCode, buildProject, rebuildProject, installDependencies }
