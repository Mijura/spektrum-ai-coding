import { z } from "zod"

const ProjectDetailsSchema = z.object({
	name: z.string().describe("Short name of the project. Should be filled only if it's empty."),
	description: z.string().describe("Short description of the project purpose. Should be filled only if it's empty.")
})



export { ProjectDetailsSchema }
