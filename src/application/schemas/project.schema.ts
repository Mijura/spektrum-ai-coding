import { ProjectStatus } from "@domain/entities/project"
import { z } from "zod"

const ProjectDetailsSchema = z.object({
	id: z.string().describe("Unique identifier of the project."),
	ownerId: z.string().describe("Unique identifier of the project owner."),
	created: z.string().describe("Date and time of the project creation."),
	updated: z.string().nullable().describe("Date and time of the project last update."),
	deploymentId: z.string().nullable().describe("Unique identifier of the project deployment."),
	status: z.nativeEnum(ProjectStatus).describe("Current status of the project."),
	name: z.string().describe("Short name of the project. Should be filled only if it's empty."),
	description: z.string().describe("Short description of the project purpose. Should be filled only if it's empty.")
})

const ProductOwnerSchema = z.object({
	projectDetails: ProjectDetailsSchema,
	ticket: z.object({
		title: z.string().describe("Short and concise title of the ticket."),
		description: z.string().describe("Concrete description what should be implemented, why it should be implemented and what shouldn't be implemented.")}),
	message: z.string().describe("Concrete Comment to user about what you plan to do or what you did.")
})



export { ProjectDetailsSchema, ProductOwnerSchema }
