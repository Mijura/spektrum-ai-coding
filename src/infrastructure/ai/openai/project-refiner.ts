import { z } from "zod"
import { ProjectDetails } from "@domain/types/project-details"
import { Task } from "@domain/entities/task" 
import { OpenAIContributor, Brain } from "./contributor"

export class ProjectRefiner extends OpenAIContributor {
    
    name: string = "Project Refiner"

    brain = Brain.GPT_41_NANO

    thoughtShape = z.object({
        project: z.object({
            name: z.string().describe("Short and concise title of the project."),
            description: z.string().describe("Project description withtout technical details in single sentence.")}),
    })

    task!: Task

    async preThought(task: Task): Promise<void> {
        this.task = task
    }

    loadContext(): string {
        return `
                
            ### **Your Task:**
            1) Based on the task details, create a project name and description.
    
            ### **Task Details:** ${JSON.stringify(this.task)}


            Important:
                - Respond only in valid JSON. The JSON object you return should match the following schema.

            ### **Output Example**
            {
                "project": {
                    "name": "Simple Note-taking app",
                    "description": "A simple note-taking app that allows you to create, edit, and delete notes."
                }
            }
            
            ### **Output Format** 
            ${JSON.stringify(this.thoughtShape.shape)}
        `
    }

    async afterThought(thought: z.infer<typeof this.thoughtShape>): Promise<ProjectDetails> {
        const { project } = thought
        return project
    }
}