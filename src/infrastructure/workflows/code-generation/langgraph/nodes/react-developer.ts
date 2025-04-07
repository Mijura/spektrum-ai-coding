import { ChatOpenAI } from "@langchain/openai"
import { PromptTemplate } from "@langchain/core/prompts"
import { RunnableSequence } from "@langchain/core/runnables"
import { Annotation } from "@langchain/langgraph"
import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { RootAnnotation } from "../state/root-annotation"
import { SourceCodeSchema } from "@application/schemas/source-code.schema"
import { SourceCodeDto } from "@domain/types/project"

const DeveloperOutputAnnotation = Annotation.Root({
	sourceCode: Annotation<SourceCodeDto>(),
})

/**
 * React Developer Node
 * 
 * This function is responsible for developing React components based on the provided source code and feature request.
 * 
 * @param _state Graph State
 * @returns State with source code
 */
const reactDeveloper = async (_state: typeof RootAnnotation.State) => {
	const { project, message, frontendDevelopmentService } = _state

	//console.log(`\n\n\nDeveloper:\n\nRecieved Ticket:\n\n${ticket}`)


	const sourceCodeBefore = await frontendDevelopmentService.fetchSourceCode(project.id)
	//console.log(`Source Code Before Generation:\n\n${JSON.stringify(sourceCodeBefore)}`)

	const parser = StructuredOutputParser.fromZodSchema(SourceCodeSchema)
	
	const chain = RunnableSequence.from([
		PromptTemplate.fromTemplate(`You are an expert React Developer.

			### Role:
			You are an AI React Frontend Developer working on React/Typescript project. 

			### **Your Task:**
			1. **Analyze the current source code** to determine if the required functionality already exists.
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
			- Pay attention on tailwind version. We are using Tailwind CSS v3, so all the classes should be compatible with this version.
			- Double check all imports or require statements to ensure they are listed in the package.json file.
			- Respond only in valid JSON. The JSON object you return should match the following schema:

			{{
				"src/App.tsx": 'export default function App() {{ return <div>Hello World</div>; }}'
			}}

			Format Instructions: {outputSchema}


			`),
		new ChatOpenAI({
			modelName: "o3-mini",
			openAIApiKey: process.env.OPENAI_API_KEY,
		}),
		parser,
	])

	const sourceCodeAfter = await chain.invoke({
		ticket: message,
		project: project,
		sourceCode: sourceCodeBefore,
		outputSchema: parser.getFormatInstructions(),
	})

	return {
		..._state,
		sourceCode: sourceCodeAfter,
		message: sourceCodeAfter,
	}
}

export { reactDeveloper, DeveloperOutputAnnotation }
