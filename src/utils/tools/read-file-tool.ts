import * as fs from "fs/promises"
import * as path from "path"
import { tool } from "@langchain/core/tools"
import { z } from "zod"

const readFileTool = tool(
	async ({ filename, projectId }) => {
		const filePath = path.join(`projects/${projectId}`, filename)
		return await fs.readFile(filePath, "utf-8")
	},
	{
		name: "readFile",
		description: "Read the specified file.",
		schema: z.object({
			filename: z.string(),
			projectId: z.string(),
		}),
	}
)

export { readFileTool }
