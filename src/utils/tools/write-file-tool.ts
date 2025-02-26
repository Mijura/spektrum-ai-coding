import * as fs from "fs/promises"
import * as path from "path"
import { tool } from "@langchain/core/tools"
import { z } from "zod"

const writeFileTool = tool(
	async ({ projectId, filename, content }) => {
        console.log(`File writing: ${filename}`)
		const filePath = path.join(`projects/${projectId}`, filename)
		await fs.writeFile(filePath, content)
		return `File saved to ${filename}`
	},
	{
		name: "writeFile",
		description: "Create new or edit exisiting file.",
		schema: z.object({
			filename: z.string(),
			projectId: z.string(),
			content: z.string(),
		}),
	}
)

export { writeFileTool }