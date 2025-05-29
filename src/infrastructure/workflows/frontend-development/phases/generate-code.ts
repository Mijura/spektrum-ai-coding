import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { RunnableSequence } from "@langchain/core/runnables"
import { PromptTemplate } from "@langchain/core/prompts"
import { reactDeveloperModel } from "@infrastructure/workflows/models"
import { TaskMapper } from "@infrastructure/mappers/task-mapper"
import { taskRepository } from "@infrastructure/dependencies"
import { State } from "../main"
import { z } from "zod"
import { WorkflowPhase } from "@domain/workflow/workflow-phase"

const SourceCodeSchema = z.record(
	z.string().describe("The file path as a string"),
	z.string().describe("The source code (content) inside a file")
)

const DeveloperOutputSchema = z.object({
	sourceCode: SourceCodeSchema,
	comment: z.string().describe("The comment to be added to the task. It's a short summary of the changes you made from the user's perspective")
})
export class GenerateCode extends WorkflowPhase {
    name: string = "GenerateCode"

    async execute(data: State): Promise<void> {
        console.log("Generating code")
        
        const { task, sourceCode, workflowRun, accountId, project } = data

        task.startedWork("React Developer", "GenerateCode", "Developer is developing the feature...")

        const parser = StructuredOutputParser.fromZodSchema(DeveloperOutputSchema)
	
        const chain = RunnableSequence.from([
            PromptTemplate.fromTemplate(`
                ### Role:
                You are an React Frontend Developer working on React project with Tailwind CSS and Framer Motion. 
    
                ### **Your Tasks:**
                1. ** Analyze task details, activities, and comments." Figure out what should be done to resolve the task.
                    ** You can recognize your prior activities by author name 'React Developer' **
                
                ****Analyze the current source code** to determine if the required functionality already exists.
                - If the functionality exists, modify it as needed.
                - If the functionality does not exist, create new components, hooks, or utilities as required.
                
                2. **Modify or create source files as needed**:
                - Create new components, hooks, or utilities as required.
    
                3. ** Create a reusable components in the src/components folder if needed**:
                - Create a reusable components in the separate files.
                - Use the components in the source code.

                4. **If you are using a new dependency, you should add it to the package.json file.**:
                - For example, if you are using react-hook-form, you should add it to the package.json file.
                - NOTE: If you don't add the dependency to the package.json file, the project will not work.
    
                ### **Details**
                - **Task Details:** {task}
                - **Current Source Code:** {sourceCode}
    
                Important:
                - Double check all imports or require statements to ensure they are listed in the package.json file.
                - Respond only in valid JSON. The JSON object you return should match the following schema.

                Format Instructions: {outputSchema}
    
    
                `),
                reactDeveloperModel,
            parser,
        ])
    
        const output = await chain.invoke({
            task: TaskMapper.toRecord(task),
            sourceCode: sourceCode,
            outputSchema: parser.getFormatInstructions(),
        })
    
        task.finishedWork("React Developer", "GenerateCode", "Finished with coding")
        task.leaveComment("React Developer", output.comment)
        await taskRepository.save(task)

        const updatedState: State = {
            task,
            sourceCode: output.sourceCode,
            workflowRun,
            project,
            accountId
        }

        console.log("Transitioning to UpdateCode")

        this.transitionTo("UpdateCode", updatedState)


    }
}