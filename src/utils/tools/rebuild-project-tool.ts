import fs from "fs-extra"
import * as path from "path"
import { tool } from "@langchain/core/tools"
import { ProjectSchema } from "@schemas/project.schema"
import { ToolNode } from "@langchain/langgraph/prebuilt"
import { buildProject, installDependencies } from "@utils/project"

const rebuildProjectTool = tool(
	async (project) => {

		const {projectId, sourceCode } = project
		const projectPath = path.resolve(`projects/${projectId}`)

		try {

            let promises = []
			for (const [filePath, fileDetails] of Object.entries(sourceCode)) {
				const fullPath = path.join(projectPath, filePath)
				await fs.ensureFile(fullPath)
				const writingPromise = fs.writeFile(fullPath, fileDetails.code, "utf-8")
                promises.push(writingPromise)
			}

            await Promise.all(promises)
			await installDependencies(projectPath)
			await buildProject(projectPath)
		} catch (error) {
			console.error("Error writing files:", error)
			throw error
		}

		return "Project updated and built succesfylly."
	},
	{
		name: "rebuild-project",
		description: "Write files to the file system and build React project",
		schema: ProjectSchema,
	}
)

const tools = [rebuildProjectTool]

const rebuildProject = new ToolNode(tools)

export { rebuildProject }
