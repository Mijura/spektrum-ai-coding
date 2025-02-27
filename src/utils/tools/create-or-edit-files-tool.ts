import fs from "fs-extra"
import * as path from "path"
import { tool } from "@langchain/core/tools"
import ProjectDtoSchema from "@schemas/project.schema"

const createOrEditFilesTool = tool(
	async (project) => {

		const projectPath = path.resolve(`projects/${project.projectId}`)

		try {
			for (const [filePath, fileDetails] of Object.entries(project.files)) {
				const fullPath = path.join(projectPath, filePath)
				await fs.ensureFile(fullPath)
				await fs.writeFile(fullPath, fileDetails.code, "utf-8")
			}
	


		} catch (error) {
			console.error("Error updating project source code:", error)
			throw error
		}




		return ('Files succesfully saved on the disk.')
	},
	{
		name: "createOrEditFiles",
		description: "Create new or edit multiple files.",
		schema: ProjectDtoSchema
	}
)

export { createOrEditFilesTool }