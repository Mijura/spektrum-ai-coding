import { z } from "zod"

const SourceCodeSchema = z.record(
	z.string().describe("The file path as a string"),
	z.string().describe("The source code (content) inside a file")
)

const DeveloperOutputSchema = z.object({
	sourceCode: SourceCodeSchema,
	comment: z.string().describe("The comment to be added to the ticket. It's a short summary of the changes you made from the user's perspective")
})


export { SourceCodeSchema, DeveloperOutputSchema }