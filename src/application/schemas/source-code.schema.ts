import { z } from "zod"

const SourceCodeSchema = z.record(
	z.string().describe("The file path as a string"),
	z.string().describe("The source code (content) inside a file")
)


export { SourceCodeSchema }