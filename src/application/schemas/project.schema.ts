import { z } from "zod"

const ProjectSchema = z.object({
	id: z.string().describe("The project id"),
	name: z.string().describe("Short name of the project. Should be filled only if it's empty.").optional(),
	description: z.string().describe("Short description of the project purpose. Should be filled only if it's empty.").optional(),
	owner: z.string().describe("The user id"),
	context: z.string().describe("The broader description of the project. It should contain all users preferences and feature list - it should be updated after each user request.").optional()
})

export { ProjectSchema }
