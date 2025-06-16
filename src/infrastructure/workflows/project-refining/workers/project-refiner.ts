import { z } from "zod"
import { ProjectDetails } from "@domain/types/project-details"
import { AIWorker, Brain } from "@honeycomb-app/hexacore"
import { Task } from "@domain/entities/task" 

export class ProjectRefiner extends AIWorker {


    brain = Brain.GPT_41_NANO

    thoughtShape = z.object({
        project: z.object({
            name: z.string().describe("Short and concise title of the task."),
            description: z.string().describe("Concrete description what should be implemented, why it should be implemented and what shouldn't be implemented.")}),
    })

    task: Task

    constructor(task: Task) {
        super()
        this.task = task
    }

    loadContext(): string {
        return `
            ### Role:
            You are an product owner expert on React project with Tailwind CSS and Framer Motion.
                
            ### **Your Task:**
            1) Analyze task title, task description provided by user.
            2) Based on the task details, create a project name and description.
    
            ### **Task Details:** ${JSON.stringify(this.task)}


            Important:
                - Respond only in valid JSON. The JSON object you return should match the following schema.
            
            ### **Output Format** 
            ${JSON.stringify(this.thoughtShape.shape)}
        `
    }

    async afterThought(thought: z.infer<typeof this.thoughtShape>): Promise<ProjectDetails> {

        const { project } = thought
        return project
    }
}