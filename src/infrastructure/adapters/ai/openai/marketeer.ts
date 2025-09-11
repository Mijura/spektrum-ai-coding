import { ProjectDetails } from "@domain/value-objects/project-details"
import { Task } from "@domain/entities/task" 
import { OpenAIContributor, Brain, ReasoningEffort } from "./contributor"
import { z } from "zod"

export class Marketeer extends OpenAIContributor {
    
    name: string = "Marketeer"

    brain = Brain.GPT_5_NANO

    reasoningEffort = ReasoningEffort.LOW

    thoughtShape = z.object({
        project: z.object({
            name: z.string().describe("Short and concise title of the project."),
            description: z.string().describe("Project description withtout technical details in single sentence.")}),
    })

    task!: Task

    async preThought(task: Task): Promise<void> {
        this.task = task
        console.log('Marketeer is thinking about the project name and description...')
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
        console.log('Marketeer finished generating the project name and description')
        return project
    }
}