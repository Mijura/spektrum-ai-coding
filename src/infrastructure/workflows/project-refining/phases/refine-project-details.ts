import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { RunnableSequence } from "@langchain/core/runnables"
import { PromptTemplate } from "@langchain/core/prompts"
import { gpt41Nano } from "@infrastructure/workflows/models"
import { z } from "zod"
import { TaskMapper } from "@infrastructure/mappers/task-mapper"
import { Input } from "../runner"
import { ProjectDetails } from "@domain/types/project-details"
import { WorkflowPhase } from "@honeycomb-app/hexacore"


const ProjectDetailsSchema = z.object({
	project: z.object({
		name: z.string().describe("Short and concise title of the task."),
		description: z.string().describe("Concrete description what should be implemented, why it should be implemented and what shouldn't be implemented.")}),
})

export class RefineProjectDetails extends WorkflowPhase {
    name: string = "RefineProjectDetails"

    async execute(data: Input): Promise<ProjectDetails> {

        console.log("Refining project details")
        const { task } = data

        const parser = StructuredOutputParser.fromZodSchema(ProjectDetailsSchema)
    
        const chain = RunnableSequence.from([
            PromptTemplate.fromTemplate(`
                
                ### Role:
                You are an product owner expert on React project with Tailwind CSS and Framer Motion.
                
                ### **Your Task:**
                1) Analyze task title, task description provided by user.
                2) Based on the task details, refine project details.
    
                ### **Task Details:** {task}
    
                You must return JSON as response. 

                Here is example of valid response:
                {{
                    "project": 
                        {{
                            name: 'Note-Taking App', 
                            description: 'A notetaking app with a focus on simplicity and ease of use.'
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

        return response.project


    }
}