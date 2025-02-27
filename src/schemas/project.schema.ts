import { z } from "zod"

// FileDto Schema (map of file paths to FileContentDto)
const FileDtoSchema = z.record(
	z.string().describe("The file path as a string"),
	z.object({
		code: z.string().describe("The source code (content) inside a file"),
		context: z.string().describe("Provides a semantic summary of the file's purpose, responsibilities, and implemented features. It captures what functionality the file implements, its role within the codebase architecture, and any specific features or business logic it contains.")
	})
)

const ProjectDtoSchema = z.object({
	projectId: z.string().describe("The project id"),
	files: FileDtoSchema.describe("A map of file paths to their file details"),
})

export default ProjectDtoSchema