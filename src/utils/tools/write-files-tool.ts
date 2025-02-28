import fs from "fs-extra"
import * as path from "path"
import { tool } from "@langchain/core/tools"
import { z } from "zod"
import { ProjectSchema } from "@schemas/project.schema"
import { ToolNode } from "@langchain/langgraph/prebuilt"

const writeFiles = tool(
	async (project) => {
		const projectPath = path.resolve(`projects/${project.projectId}`)

		try {
			for (const [filePath, fileDetails] of Object.entries(project.sourceCode)) {
				const fullPath = path.join(projectPath, filePath)
				await fs.ensureFile(fullPath)
				await fs.writeFile(fullPath, fileDetails.code, "utf-8")
			}
		} catch (error) {
			console.error("Error writing files:", error)
			throw error
		}

		return "Files succesfully saved on the disk."
	},
	{
		name: "writeFiles",
		description: "Write files to the file system.",
		schema: ProjectSchema,
	}
)

const tools = [writeFiles]

const writeFilesTool = new ToolNode(tools)

export { writeFilesTool }
