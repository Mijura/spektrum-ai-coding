import { PromptTemplate } from "@langchain/core/prompts"
import { RunnableSequence } from "@langchain/core/runnables"
import { Annotation } from "@langchain/langgraph"
import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { RootAnnotation } from "../root-annotation"
import { DeveloperOutputSchema } from "@application/schemas/source-code.schema"
import { reactDeveloperModel } from "@infrastructure/workflows/models"
import { SourceCode } from "@domain/entities/source-code"
import { TicketMapper } from "@infrastructure/mappers/ticket-mapper"
import { ProjectMapper } from "@infrastructure/mappers/project-mapper"

const DeveloperOutputAnnotation = Annotation.Root({
	sourceCode: Annotation<SourceCode>(),
})

/**
 * React Developer Node
 * 
 * This function is responsible for developing React components based on the provided source code and feature request.
 * 
 * @param input Graph State
 * @returns State with ticket, project and source code
 */
const reactDeveloper = async (input: typeof RootAnnotation.State) => {
	const { project, ticket, sourceCode } = input

	const parser = StructuredOutputParser.fromZodSchema(DeveloperOutputSchema)
	
	const chain = RunnableSequence.from([
		PromptTemplate.fromTemplate(`
			### Role:
			You are an React Frontend Developer working on React project with Tailwind CSS and Framer Motion. 

			### **Your Task:**
			1. ** Analyze ticket details, activities, and comments." Figure out what should be done to resolve the issue.
				** You can recognize your prior activities by author name 'React Developer' **
			
			****Analyze the current source code** to determine if the required functionality already exists.
			- If the functionality exists, modify it as needed.
			- If the functionality does not exist, create new code to implement it.
			
			2. **Modify or create source files as needed**:
			- Create new components, hooks, or utilities as required.

			3. **Modify package.json when you plan to use external dependencies**:
			- If a new dependency is introduced, update package.json.


			### **Project Details**
			- **Project Context:** {project}
			- **Ticket Details:** {ticket}
			- **Current Source Code:** {sourceCode}

			Important:
			- Double check all imports or require statements to ensure they are listed in the package.json file.
			- Respond only in valid JSON. The JSON object you return should match the following schema:

			{{
				"sourceCode": {{
					"src/App.tsx": 'export default function App() {{ return <div>Hello World</div>; }}'
				}},
				"comment": "I implemented Hello World to be sure the project is working."
			}}

			Format Instructions: {outputSchema}


			`),
			reactDeveloperModel,
		parser,
	])

	const output = await chain.invoke({
		ticket: TicketMapper.toRecord(ticket),
		project: ProjectMapper.toRecord(project),
		sourceCode: sourceCode,
		outputSchema: parser.getFormatInstructions(),
	})

	return {
		...input,
		sourceCode: output.sourceCode
	}
}

export { reactDeveloper, DeveloperOutputAnnotation }
