import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { RunnableSequence } from "@langchain/core/runnables"
import { PromptTemplate } from "@langchain/core/prompts"
import { gpt41Nano } from "@infrastructure/workflows/models"
import { z } from "zod"
import { TaskMapper } from "@infrastructure/mappers/task-mapper"
import { WorkflowPhase } from "../../../../domain/entities/workflow/workflow-phase"
import { State } from "../../prototyping/main"
import { Task } from "@domain/entities/task"

const ProductOwnerSchema = z.object({
	task: z.object({
		title: z.string().describe("Short and concise title of the task."),
		description: z.string().describe("Concrete description what should be implemented, why it should be implemented and what shouldn't be implemented.")}),
})

export class RefineTask extends WorkflowPhase {
    name: string = "RefineTask"

    async execute(data: State): Promise<Task> {

        console.log("Refining task")
        const { task } = data

        task.startedWork("Product Owner", "RefineTask", "Product owner is updating task details")

        
        const parser = StructuredOutputParser.fromZodSchema(ProductOwnerSchema)
    
        const chain = RunnableSequence.from([
            PromptTemplate.fromTemplate(`
                
                ### Role:
                You are an product owner expert on React project with Tailwind CSS and Framer Motion.
                
                ### **Your Task:**
                1) Analyze task title, task description provided by user.
                2) Refine task title and description based on the user request.
    
                ### **Task Details:** {task}

                You must return JSON as response. Here is example of valid response:
                {{
                    "task": 
                        {{
                            title: 'Enable user to add notes and display it after adding', 
                            description: 'Implement note adding and displaying functioanlity.'
                        }}
                }}
                `),
                gpt41Nano,
            parser,
        ])
    
        const response = await chain.invoke({
            task: TaskMapper.toRecord(task),
            outputSchema: parser.getFormatInstructions(),
        })

        task.finishedWork("Product Owner", "RefineTask", "Finished updating task details")
   
        
        task.updateTitle("Product Owner", response.task.title)
        task.updateDescription("Product Owner", response.task.description)

        return task


    }
}