import * as path from "path"
import { tool } from "@langchain/core/tools"
import { z } from "zod"
import { installDependencies } from "@utils/project"

const installDependenciesTool = tool(
	async ({ projectId }) => {
        console.log(`Installing dependencies: ${projectId}`)
		const projectPath: string = path.join("projects", projectId)
		await installDependencies(projectPath)
	},
	{
		name: "buildProject",
		description: "Build React project.",
		schema: z.object({
			projectId: z.string(),
		}),
	}
)

export { installDependenciesTool }
