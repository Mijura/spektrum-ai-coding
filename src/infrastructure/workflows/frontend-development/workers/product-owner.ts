import { Task } from "@domain/entities/task"
import { Contributor, Brain } from "@honeycomb-app/hexacore"
import z from "zod"


export class ProductOwner extends Contributor {
    
    name: string = "Product Owner"

    brain = Brain.GPT_41_NANO

    thoughtShape = z.object({
        description: z.string().describe("The task description for the further implementation.")
    })

    task!: Task

    async preThought(task: Task): Promise<void> {
        this.task = task
    }

    loadContext(): string {
        return `
            ### Role:
            You are a **Product Owner** expert.

            ### **Your Tasks:**

            1. ** Analyze task, activities, and comments." 
            - Figure out what user wants to achieve.

            2. **Translate user's request into a task description.**
            - Do not ask user or other contributors for clarification or additional information.
            - Just create as detailed as possible task from user perspective.
            - Do not suggest any technical details, just themes and ideas.

            ---

            ### **Details**
            - **Task:** ${JSON.stringify(this.task)}  
            ---

            `
    }

    async afterThought(tought: z.infer<typeof this.thoughtShape>): Promise<any> {
        const { description } = tought

        this.task.leaveComment("Product Owner", description)

        console.log("Passing task to React Developer")
        return await this.delegateTo("React Developer", this.task)
    }
    
    
}