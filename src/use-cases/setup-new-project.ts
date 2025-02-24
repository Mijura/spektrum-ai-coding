import path from "path"
import fs from "fs-extra"
import { buildProject, installDependencies } from "@utils/project"

export async function setupProject(projectId: string): Promise<string> {
	try {
		const templateName = "rspack-react-tailwind"
		const templatePath = path.resolve(`project-templates/${templateName}`)

		console.log("Checking path:", templatePath)

		const projectPath: string = path.join("projects", projectId)

		// Copy React template to new project folder
		await fs.copy(templatePath, projectPath)
		console.log(`Project template copied to ${projectPath}`)

		// Install dependencies and build the project
		await installDependencies(projectPath)
		await buildProject(projectPath)

		return projectId
	} catch (error) {
		console.error("Error setting up project:", error)
		throw error
	}
}
