import path from "path"
import fs from "fs-extra"
import { buildProject, installDependencies } from "@utils/project"
import { ProjectDto } from "@dto/project"
import { saveProject } from "@adapters/secodnary/project-database-adapter"
import { v4 as uuidv4 } from "uuid"

export async function setupProject(id: string): Promise<string> {
	try {
		const templateName = "rspack-react-tailwind"
		const templatePath = path.resolve(`project-templates/${templateName}`)

		console.log("Checking path:", templatePath)

		const projectPath: string = path.join("projects", id)

		// Copy React template to new project folder
		await fs.copy(templatePath, projectPath)
		console.log(`Project template copied to ${projectPath}`)

		// Install dependencies and build the project
		await installDependencies(projectPath)
		await buildProject(projectPath)
		const project : ProjectDto = { id: id, owner: uuidv4(), context: "", name: "", description: "" }
		await saveProject(project)

		return id
	} catch (error) {
		console.error("Error setting up project:", error)
		throw error
	}
}
