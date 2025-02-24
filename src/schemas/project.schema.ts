import { z } from "zod"

// FileDto Schema (map of file paths to FileContentDto)
const FileDtoSchema = z.record(
	z.string().describe("The file path as a string"),
	z.string().describe("The source code inside a file")
)

// ProjectDto Schema
const ProjectDtoSchema = z.object({
	sourceCode: FileDtoSchema.describe("A map of file paths to their file content"),
})

export default ProjectDtoSchema