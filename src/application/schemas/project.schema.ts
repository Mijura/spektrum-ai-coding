import { z } from "zod"

const ProjectSchema = z.object({
	id: z.string().describe("The project id"),
	name: z.string().describe("Short name of the project. Should be filled only if it's empty."),
	description: z.string().describe("Short description of the project purpose. Should be filled only if it's empty."),
	owner: z.string().describe("The user id"),
	deploymentId: z.string().describe("Project deploymen id").nullable(),
	created: z.string().describe("Date of project creation"),
	updated: z.string().describe("Date of project update").nullable()
})

export { ProjectSchema }
