import { ChatOpenAI } from "@langchain/openai"
import { PromptTemplate } from "@langchain/core/prompts"
import { RunnableSequence } from "@langchain/core/runnables"
import { Annotation } from "@langchain/langgraph"
import { SourceCodeDto } from "@dto/project"
import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { RootAnnotation } from "../team"
import { createOrEditFilesTool } from "@utils/tools/create-or-edit-files-tool"
import { ToolNode } from "@langchain/langgraph/prebuilt"
import ProjectDtoSchema from "@schemas/project.schema"

const DeveloperOutputAnnotation = Annotation.Root({
	sourceCode: Annotation<SourceCodeDto>(),
})

const tools = [createOrEditFilesTool]

const toolNodeForGraph = new ToolNode(tools)

const reactDeveloper = async (_state: typeof RootAnnotation.State) => {
	const { sourceCode, ticket, projectId } = _state

	const parser = StructuredOutputParser.fromZodSchema(ProjectDtoSchema)

	console.log(`\n\n\nDeveloper:\n\nRecieved Ticket:\n\n${ticket}`)

	console.log(`Source Code:\n\n${JSON.stringify(sourceCode)}`)

	const chain = RunnableSequence.from([
		PromptTemplate.fromTemplate(`You are an expert React Developer.

			### Role:
			You are an AI React Frontend Developer working on React/Typescript project. You are responsible for modifying project source code based on the provided ticket.


			### **Your Task:**
			1. **Analyze the current source code** to determine if the required functionality already exists.
			- If the functionality exists, modify it as needed.
			- If the functionality does not exist, create new code to implement it.

			2. **Apply the correct UI styling and animations:**
			- Use **Tailwind CSS** for styling UI components.
			- Use **Framer Motion** to create rich animations and interactions.

			3. **Modify or create source files as needed**:
			- After you generate files you must save it on the disk. This can be accomplished by calling tool createOrEditFilesTool(project)
			
			Project schema: {projectSchema}
			
			---

			### **Project Details**
			- **Project ID:** {projectId}
			- **Ticket Details:** {ticket}
			- **Current Source Code:** {sourceCode}
			
			### **Output Format**
			Your response should include the necessary tool calls in **JSON format**.

			#### **Important Notes**
			✅ **Do not implement functionality from scratch** if it already exists—modify existing code when possible.  
			✅ **Always check the current source code** before adding new functionality.  
			✅ **Ensure UI elements follow Tailwind CSS and animations use Framer Motion.**  
			✅ **Call all necessary tools using the correct structured format.** 

			`),
		new ChatOpenAI({
			modelName: "gpt-4o",
			openAIApiKey: process.env.OPENAI_API_KEY,
		}).bindTools(tools),
	])

	const response = await chain.invoke({
		ticket: ticket,
		projectId: projectId,
		sourceCode: sourceCode,
		projectSchema: parser.getFormatInstructions(),
	})

	console.log(response)

	return { messages: response }
}

export { reactDeveloper, toolNodeForGraph, DeveloperOutputAnnotation }
