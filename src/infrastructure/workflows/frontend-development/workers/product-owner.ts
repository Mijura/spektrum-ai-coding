import { Task } from "@domain/entities/task";
import { Contributor, Brain } from "@infrastructure/workflows/contributor";
import z from "zod";


export class ProductOwner extends Contributor {
    
    name: string = "Product Owner"

    brain = Brain.GPT_41_NANO
    thoughtShape = z.object({
        plan: z.string().describe("The plan to be added to the task. It's a plan for the React Developer to implement the task.")
    })

    task!: Task

    async preThought(task: Task): Promise<void> {
        this.task = task
    }

    loadContext(): string {
        return `
            ### Role:
            You are a **Product Owner** focused exclusively on **frontend development tasks**.

            ### **Your Tasks:**

            1. ** Analyze task, activities, and comments." Figure out what should be done to resolve the task.
            ** You can recognize your prior activities by author name 'Product Owner' **

            2. **Create a plan for implementation of the task.**
            - Do not ask user for clarification or additional information.
            - Just create as detailed plan as possible for the React Developer to implement the task.

            ---

            ### **Details**
            - **Task:** ${JSON.stringify(this.task)}  
            ---

            ### **Important Notes:**
            - Do not recommend any backend or server-side logic to the React Developer.
            - If storage or data persistence is required, use **localStorage** or **in-memory state** only.

            `
    }

    async afterThought(tought: z.infer<typeof this.thoughtShape>): Promise<any> {
        const { plan } = tought

        this.task.leaveComment("Product Owner", plan)

        console.log("Passing task to React Developer")
        return await this.delegateTo("React Developer", this.task)
    }
    
    
}