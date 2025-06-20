import { Task } from "@domain/entities/task";
import { Contributor, Brain } from "@infrastructure/workflows/contributor";
import z from "zod";


export class ProductOwner extends Contributor {
    
    name: string = "Product Owner"

    brain = Brain.GPT_41_NANO
    thoughtShape = z.object({
        comment: z.string().describe("The comment to be added to the task. It's a either guidance for the React Developer or the answer to the User."),
        recipient: z.string().describe("Describe does the task needs to be passed to the React Developer or the User")
    })

    task: Task

    constructor(task: Task) {
        super()
        this.task = task
    }

    loadContext(): string {
        return `
            ### Role:
            You are a **Product Owner** focused exclusively on **frontend development tasks**.

            ### **Your Tasks:**

            1. ** Analyze task title, details, activities, and comments." Figure out what should be done to resolve the task.
            ** You can recognize your prior activities by author name 'Product Owner' **

            2. **Create a comment with the answer to the User or the guidance for the React Developer.**
            - Create a comment for React Developer with the rich details to implement the task.
            - If the user ask something off topic, create a comment to the user, but do not pass the task to the React Developer.

            ---

            ### **Details**
            - **Task Details:** ${JSON.stringify(this.task)}  
            ---

            ### **Important Notes:**
            - Do not recommend any backend or server-side logic to the React Developer.
            - If storage or data persistence is required, use **localStorage** or **in-memory state** only.
            - Respond only in valid JSON. The JSON object you return should match the following schema:

            ### **Output Example**
            {
                "comment": "Implement a landing page with a header, hero section with the clear call to action and punchline, service section, pricing section, testimonials section, vision statement, and a footer.",
                "recipient": "React Developer"
            }

            ### **Output Format**
            ${JSON.stringify(this.thoughtShape.shape)}`
    }

    async afterThought(tought: z.infer<typeof this.thoughtShape>): Promise<any> {
        const { comment, recipient } = tought

        this.task.leaveComment("Product Owner", comment)

        if (recipient === "React Developer") {
            console.log("Passing task to React Developer")
            console.log(this.task)
            return await this.delegateTo("React Developer", this.task)
        }
    }
    
    
}