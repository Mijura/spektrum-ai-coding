import { ChatOpenAI } from "@langchain/openai"
import { PromptTemplate } from "@langchain/core/prompts"
import { RunnableSequence } from "@langchain/core/runnables"
import { Annotation } from "@langchain/langgraph"
import { SourceCodeDto } from "@dto/project"
import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { RootAnnotation } from "../team"
import { SourceCodeSchema } from "@schemas/project.schema"
import { AIMessage } from "@langchain/core/messages"

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
	const { sourceCode, ticket, projectId } = _state

	const parser = StructuredOutputParser.fromZodSchema(SourceCodeSchema)

	console.log(`\n\n\nDeveloper:\n\nRecieved Ticket:\n\n${ticket}`)

	console.log(`Source Code:\n\n${JSON.stringify(sourceCode)}`)

	const chain = RunnableSequence.from([
		PromptTemplate.fromTemplate(`You are an expert React Developer.

			### Role:
			You are an AI React Frontend Developer working on React/Typescript project. 

			### **Your Task:**
			1. **Analyze the current source code** to determine if the required functionality already exists.
			- If the functionality exists, modify it as needed.
			- If the functionality does not exist, create new code to implement it.

			2. **Apply the correct UI styling and animations:**
			- Use or edit **tailwind.config.js** to:
				- Define custom colors, typography, spacing, and other design tokens.
				- Implement Material Design principles.
				- Implement consistent spacing guidelines, alignment suggestions, and grid structure for the layout.

            - **Microinteractions**: For each feature, implement hover effects, focus states, active states, and transitions to make the user interface feel dynamic and interactive. Describe specific hover/elevation behaviors, color changes, and shadow effects.
            - **Motion Effects**: Use **Framer Motion** to recommend animations for specific interactions, such as:
                - Fade-in effects for elements loading on the screen.
                - Button hover animations (e.g., scaling, color change).
                - Smooth transitions for form inputs and card components.
			
			3. **Modify or create source files as needed**:
			- Create new components, hooks, or utilities as required.

			4. **Modify package.json when you plan to use external dependencies**:
			- If a new dependency is introduced, update package.json.


			### **Project Details**
			- **Project ID:** {projectId}
			- **Ticket Details:** {ticket}
			- **Current Source Code:** {sourceCode}

			Important:
			- Pay attention on tailwind version. We are using Tailwind CSS v3, so all the classes should be compatible with this version.
			- Double check all imports or require statements to ensure they are listed in the package.json file.
			- Respond only in valid JSON. The JSON object you return should match the following schema:

            Example of valid response:
			{{
				"src/App.tsx": 'export default function App() {{ return <div>Hello World</div>; }}'
			}}

			Format Instructions: {outputSchema}

			By the end of the process, you will provide source code with  **fully detailed, interactive, and motion-aware design** using Tailwind CSS and Framer Motion.

			`),
		new ChatOpenAI({
			modelName: "o1-mini",
			openAIApiKey: process.env.OPENAI_API_KEY,
		}),
		parser,
	])

	const changes = await chain.invoke({
		ticket: ticket,
		projectId: projectId,
		sourceCode: sourceCode,
		outputSchema: parser.getFormatInstructions(),
	})

	console.log(changes)

	return {
		messages: [
			new AIMessage({
				content: "",
				additional_kwargs: {},
				response_metadata: {},
				tool_calls: [
					{
						name: "rebuild-project",
						args: {
							projectId: projectId,
							sourceCode: changes,
						},
						id: "rebuild_abcd123",
					},
				],
				invalid_tool_calls: [],
			}),
		],
	}
}

export { reactDeveloper, DeveloperOutputAnnotation }
