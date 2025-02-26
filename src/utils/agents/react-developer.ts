import { ChatOpenAI } from "@langchain/openai"
import { PromptTemplate } from "@langchain/core/prompts"
import { RunnableSequence } from "@langchain/core/runnables"
import { Annotation } from "@langchain/langgraph"
import { SourceCode } from "@dto/project"
import { StructuredOutputParser } from "@langchain/core/output_parsers"
import ProjectDtoSchema from "@schemas/project.schema"
import { RootAnnotation } from "../team"
import { writeFileTool } from "@utils/tools/write-file-tool"
import { installDependenciesTool } from "@utils/tools/install-dependencies-tool"
import { buildProjectTool } from "@utils/tools/build-project-tool"

const DeveloperOutputAnnotation = Annotation.Root({
	sourceCode: Annotation<SourceCode>(),
})

const reactDeveloper = async (_state: typeof RootAnnotation.State)  => {
	const { sourceCode, ticket, projectId } = _state

	const parser = StructuredOutputParser.fromZodSchema(ProjectDtoSchema)

	console.log(`\n\n\nDeveloper:\n\nRecieved Ticket:\n\n${ticket}`)

	const tools = [writeFileTool, installDependenciesTool, buildProjectTool]

	const chain = RunnableSequence.from([
		PromptTemplate.fromTemplate(`You are an expert React Developer.

			### Role:
			You are an AI React Frontend Developer responsible for modifying project source code based on the provided ticket.

			### **Your Task:**
			1. **Analyze the current source code** to determine if the required functionality already exists.
			- If the functionality exists, modify it as needed.
			- If the functionality does not exist, create new code to implement it.

			2. **Apply the correct UI styling and animations:**
			- Use **Tailwind CSS** for styling UI components.
			- Use **Framer Motion** to create rich animations and interactions.

			3. **Modify or create source files as needed**:
			- If you need to change a file, use "writeFileTool(projectId, filename, fileContent)".
			- If you need to add a new feature, create a new file with the appropriate content.

			4. **Manage dependencies**:
			- If "package.json" is modified, call "installDependenciesTool(projectId)" to install new dependencies.

			5. **Ensure the project is rebuilt**:
			- Once all required changes are made, call "buildProjectTool(projectId)" to rebuild the project.

			### **Tools Available:**
			- "writeFileTool(projectId: string, filename: string, content: string)": Creates or modifies files.
			- "installDependenciesTool(projectId: string)": Installs dependencies after modifying "package.json".
			- "buildProjectTool(projectId)": Rebuilds the project to apply changes.

			---

			### **Project Details**
			- **Project ID:** {projectId}
			- **Ticket Details:** {ticket}
			- **Current Source Code:** {sourceCode}
			
			### **Output Format**
			Your response must always include the necessary tool calls in **JSON format**.

			DO NOT return plain code—always call writeFileTool for any code modifications.
			ALWAYS call buildProjectTool(content) after you finish with all file changes.

			### **Important Notes**
            ✅ Do not implement functionality from scratch if it already exists—modify existing code when possible.
			✅ Always check the current source code before adding new functionality.
			✅ Ensure UI elements follow Tailwind CSS and animations use Framer Motion.
			✅ Call all necessary tools to apply changes correctly.
			


			`),
		new ChatOpenAI({
			modelName: "gpt-4o",
			openAIApiKey: process.env.OPENAI_API_KEY,
		}).bindTools(tools)
	])


	await chain.invoke({
		ticket: ticket,
		projectId: projectId,
		sourceCode: sourceCode,
	})
}

export { reactDeveloper, DeveloperOutputAnnotation }
