import { PromptTemplate } from "@langchain/core/prompts"
import { RunnableSequence } from "@langchain/core/runnables"
import { Annotation } from "@langchain/langgraph"
import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { RootAnnotation } from "../root-annotation"
import { principalDeveloperModel } from "@infrastructure/dependencies/ai-models"
import { z } from "zod"
export interface InstructionsDto {
	instructions: string[]
}
const PrincipalOutputAnnotation = Annotation.Root({
	instructions: Annotation<InstructionsDto>(),
})

const InstructionsSchema = z.object({
	instructions: z.array(z.string()).describe("List of instructions for the React Developers"),
})

/**
 * Principal JavaScript Developer 
 * 
 * This function is responsible for translating the ticket into multiple instructions for the React Developers.
 * 
 * @param _state Graph State
 * @returns State with source code
 */
const principalDeveloper = async (_state: typeof RootAnnotation.State) => {
	const { project, message, frontendDevelopmentService } = _state

	const sourceCode = await frontendDevelopmentService.fetchSourceCode(project.id)

	const parser = StructuredOutputParser.fromZodSchema(InstructionsSchema)
	
	const chain = RunnableSequence.from([
		PromptTemplate.fromTemplate(`
			### Role:
			You are an Principal JavaScript Developer working on a React project. You are responsible for creating in detail instructions for the React Developer.
            The project is building just a single page application without any backend - so you don't need to create any instructions related to backend.

			### **Your Task:**
			1. **Create in detail instructions for the React Developer for the following ticket**:

			### **Project Details**
			- **Ticket Details:** {ticket}
			- **Project Context:** {project}
            - **Current Source Code:** {sourceCode}

            ### **Important:**
            - Respond only in valid JSON. The JSON object you return should match the following schema:
            - Create multiple instructions which will be independent from each other - each instruction will be passed to separate React Developer.
            - The instructions should be in detail and include all the information needed to implement the ticket.

            ### **Example Output:**
            {{
                "instructions": ["Create a new component called 'UserProfile' that displays a user's profile information. The component should include fields for name, email, and a button to edit the profile. Use Tailwind CSS for styling.",
                    "Create profile icon in the header which should switch to new profile page when clicked called 'UserProfile'"
                ]
            }}

            ### **Format Instructions:**

			{outputSchema}


			`),
			principalDeveloperModel,
		parser,
	])

	const result = await chain.invoke({
		ticket: message,
		project: project,
		sourceCode: sourceCode,
		outputSchema: parser.getFormatInstructions(),
	})

	return {
		..._state,
		message: result.instructions,
		ticket: result.instructions,
	}
}

export { principalDeveloper, PrincipalOutputAnnotation }
