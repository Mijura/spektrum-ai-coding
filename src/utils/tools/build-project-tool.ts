import * as fs from "fs/promises"
import * as path from "path"
import { tool } from "@langchain/core/tools"
import { z } from "zod"
import { buildProject } from "@utils/project"

const buildProjectTool = tool(
	async ({ projectId }) => {
        console.log(`Building project: ${projectId}`)
		const projectPath: string = path.join("projects", projectId)
		await buildProject(projectPath)
	},
	{
		name: "buildProject",
		description: "Build React project.",
		schema: z.object({
			projectId: z.string(),
		}),
	}
)

export { buildProjectTool }
