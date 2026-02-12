import { CodeGeneratorPort } from "@app/ports/services/code-generator"
import { FileArtifacts } from "@domain/file-artifacts"
import { Agent, Command } from "@mozaik-ai/core"
import { Task } from "@jigjoy-ai/task-contracts"
import z from "zod"

export class JigJoyCodeGenerator implements CodeGeneratorPort {
	constructor() {}

	async generateCode(task: Task, sourceCode: FileArtifacts): Promise<{ comment: string; sourceCode: FileArtifacts }> {
		console.log("Generating code for task", task)
		const outputSchema = z.object({
			sourceCode: z
				.object({})
				.catchall(z.string().describe("The source code (content) inside a file"))
				.describe("A map where each key is a file path and the value is the source code for that file"),
			comment: z
				.string()
				.describe(
					"The comment to be added to the task. It's a short summary of the changes you made from the user's perspective",
				),
		})

		const command: Command = {
			model: "gpt-5",
			task: `### Role:
            You are an React Frontend Developer working on React project with Tailwind CSS and Framer Motion. 
    
            ### **Your Tasks:**

                1. **Modify or create new files according the task description and activities**:
                - When create a new feature, you should create a reusable components in the separate files.
                - You should use the components in the src/components/ui folder to develop new features.
                - You should keep all previous features visible and working.
                - When new feature is requested, you should ensure that its visible to the user, along with all previous features.
                - You should always update the package.json file to add new dependencies.
                - Figure out from the task history what should you do.

                **Here is the whole task history:**
                ${JSON.stringify(task)}

                MOST IMPORTANT:
                - Update package.json if you plan to import new dependencies. (e.g. "chart.js" should be added to the dependencies)
                - Always use classes from the index.css and tailwind.config.js files.
                - Do not put technology names in the code. (e.g. "Application created using React, Tailwind CSS and Framer Motion...")
                - Do not use 'JigJoy' in the code. (e.g. "JigJoy Blog, Application created using JigJoy, etc..."), but keep the JigJoy meta tags in the index.html file, except user request change of meta tags.
    
                ### **Details**
                - **Current Source Code:** ${JSON.stringify(sourceCode)}
            `,
			structuredOutput: outputSchema,
		}

		const developer = new Agent(command)

		const response = await developer.act()
		console.log("Code generation finished")

		const updatedSourceCode = {
			...sourceCode,
			...response.sourceCode,
		}

		return {
			comment: response.comment,
			sourceCode: updatedSourceCode,
		}
	}
}
