import { Task } from "@domain/entities/task";
import { Contributor, Brain } from "@infrastructure/workflows/contributor";
import z from "zod";


export class ProductOwner extends Contributor {
    
    name: string = "Product Owner"

    brain = Brain.GPT_41_NANO
    thoughtShape = z.object({
        description: z.string().describe("The plan to be added to the task. It's a plan for the React Developer to implement the task.")
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

            1. ** Analyze task, activities, and comments." Figure out what should be done to resolve the task.
            ** You can recognize your prior activities by author name 'Product Owner' **

            2. **Create a task description for further implementation.**
            - Do not ask user for clarification or additional information.
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