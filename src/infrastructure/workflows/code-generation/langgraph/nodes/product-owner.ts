import { ChatOpenAI } from "@langchain/openai"
import { PromptTemplate } from "@langchain/core/prompts"
import { RunnableSequence } from "@langchain/core/runnables"
import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { RootAnnotation } from "../state/root-annotation"


import { ProjectDetailsSchema } from "@application/schemas/project.schema"
import { z } from "zod"
import { ProjectDto } from "@domain/types/project"

interface ProductOwnerOutput {
	project: ProjectDto
	tickets: string[]
	message: string
}

const ProductOwnerSchema = z.object({
	projectDetails: ProjectDetailsSchema,
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

			You should also populate projectDetails.name and projectDetails.description fields if needed.

			You must return JSON as response. Here is example of valid response:
			{{
				"tickets": ['Feature 1: Enable user to add notes and display it after adding', 'Feature 2: Implement note editing'],
				"projectDetails": {{
					name: 'Note Taking App',
					description: 'App for taking notes',
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

	return {
		..._state,
		tickets: response.tickets,
		project: {
			...project,
			...response.projectDetails,
		},
		message: response.message
	}
}

export { productOwner }
