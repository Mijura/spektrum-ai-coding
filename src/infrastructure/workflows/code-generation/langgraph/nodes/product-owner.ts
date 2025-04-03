import { ChatOpenAI } from "@langchain/openai"
import { PromptTemplate } from "@langchain/core/prompts"
import { RunnableSequence } from "@langchain/core/runnables"
import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { RootAnnotation } from "../state/root-annotation"


import { ProjectSchema } from "@application/schemas/project.schema"
import { z } from "zod"
import { ProjectDto } from "@domain/types/project"
import { ProjectStatus } from "@domain/entities/project"

interface ProductOwnerOutput {
	project: ProjectDto
	tickets: string[]
	message: string
}

const ProductOwnerSchema = z.object({
	project: ProjectSchema,
	tickets: z.array(z.string()).describe("The ticket with list of features to be implemented"),
	message: z.string().describe("Description of what you plan to do that will be shown to user")
})


/**
 * Product Owner Node
 *
 * This function is responsible for transforming user request into a ticket for developers.
 *
 * @param _state Graph State
 * @returns State with ticket
 */
const productOwner = async (_state: typeof RootAnnotation.State): Promise<ProductOwnerOutput> => {
	const { userRequest, project } = _state

	//console.log(`\n\n\nProduct Owner:\n\nRecieved Ticket:\n\n${userRequest}`)

	const parser = StructuredOutputParser.fromZodSchema(ProductOwnerSchema)

	const chain = RunnableSequence.from([
		PromptTemplate.fromTemplate(`You are an product owner exper. Your task is to transform user request into the list of tickets for developers.

			Create a concise and minimal description. If the request is too broad try to minimize the request. 
			Each task should be cohesive representing unit which have sense for user.
			For example if the user demand note taking app, try to figure out what is the essence for this request.

			Good output in this case would be:
			Feature 1: Enable user to add notes and see all added notes.
			 
			Bad otput:
			Feature 1: Implement login and registration to the system
			Feature 2: Enable user to add notes
			Feature 3: Implement notes overview
			Feature 4: Implement notes editin
			Feature 5: Implement note deletion
			Feature 6: Pay attention on performances

			To summuarize don't suggest any additional improvements nor too broad features - just essence of user request.

			User Request: {userRequest}
			Project Context: {project}

			Project Details may be incomplete in the beginning, your task is to fill it and maintain context field every new user request. You should also populate name and description fields if needed.

			Example of valid response:
			{{
				"tickets": ['Feature 1: Enable user to add notes and display it after adding', 'Feature 2: Implement note editing'],
				"project": {{
					id: 'e4cb89b1-c1e5-4e94-bc3c-2056344a1369',
					name: 'Note Taking App',
					description: 'App for taking notes',
					ownerId: 'c8e64f96-8450-4925-8077-04bfd8e1014e',
					created: '2025-03-13T18:08:06.653Z',
					updated: null,
					status: 'Active',
					deploymentId: null
				}},
				"message" : "I created task and pass to the team for implementation. The team will implement note adding and displaying. "
			}}
			`),
		new ChatOpenAI({
			modelName: "o1-mini",
			apiKey: process.env.OPENAI_API_KEY
		}),
		parser,
	])

	const response = await chain.invoke({
		userRequest,
		project,
		outputSchema: parser.getFormatInstructions(),
	})

	
	//console.log(`\n\n\nProduct Owner:\n\nTicket:\n\n${JSON.stringify(response.ticket)}`)

	return {
		..._state,
		tickets: response.tickets,
		project: {
			...response.project,
			status: response.project.status as ProjectStatus
		},
		message: response.message
	}
}

export { productOwner }
