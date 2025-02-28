import { z } from "zod"

// FileDto Schema (map of file paths to FileContentDto)
const SourceCodeSchema = z.record(
	z.string().describe("The file path as a string"),
	z.object({
		code: z.string().describe("The source code (content) inside a file"),
		context: z
			.string()
			.describe(
				"Provides a semantic summary of the file's purpose, responsibilities, and implemented features. It captures what functionality the file implements, its role within the codebase architecture, and any specific features or business logic it contains."
			),
	})
)

const ProjectSchema = z.object({
	projectId: z.string().describe("The project id"),
	sourceCode: SourceCodeSchema.describe("Corresponding file paths and details of each source code file in the project"),
})

export { ProjectSchema, SourceCodeSchema }
