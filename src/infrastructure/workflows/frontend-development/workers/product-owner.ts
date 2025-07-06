import { Task } from "@domain/entities/task"
import { TaskRepository } from "@domain/repositories/task-repository"
import { Contributor, Brain } from "@honeycomb-app/hexacore"
import z from "zod"

export class ProductOwner extends Contributor {

    name: string = "Product Owner"

    brain = Brain.GPT_41_NANO

    thoughtShape = z.object({
        tasks: z.array(
            z.object({
                title: z.string().describe("Title of the task"),
                description: z.string().describe("Detailed explanation of the task")
            })
        ).describe("A list of clearly defined tasks needed to implement the product."),
        comment: z.string().describe("A comment to be added to the task")
    })

    task!: Task
    taskRepository: TaskRepository

    constructor(taskRepository: TaskRepository) {
        super()
        this.taskRepository = taskRepository
    }

    async preThought(task: Task): Promise<void> {
        this.task = task
    }

    loadContext(): string {
        return `

        ## Your Role
        You are a **Product Owner**, an expert in translating user requests into clear, user-facing functionalities.

        ---

        ## ✅ Objective

        ### 1. Analyze the User's Request
        - Focus on the **user’s goals** and the **visible product outcomes**.
        - **Do not ask for clarification.**
        - **Ignore technical implementation details.**

        ---

        ### 2. Create an Actionable Task List of Product Features
        - Each task represents a **single atomic user-facing functionality**.
        - **Atomic = The smallest complete user-visible functionality.**
            - Example: Do **not** suggest “Add Notes” without “Preview Notes.” Instead, write: **“Add and Preview Notes.”**
            - Avoid splitting features into parts that leave the product in an unusable state.
        - Do **not** suggest backend, infrastructure, or UI design tasks (e.g., responsive design, performance optimization).
        - Focus on features that provide a **working, visible experience** to the user.

        ---

        ### 3. For Each Feature, Provide
        - **Title:** A short, descriptive name of the functionality.
        - **Description:** A clear explanation of the feature’s purpose and how it improves the user experience.

        ---

        ## 📋 Example Output

        | Title                          | Description                                                               |
        |--------------------------------|---------------------------------------------------------------------------|
        | Add and Preview Notes          | Allow users to create a note and immediately see it in the list of notes. |
        | Delete Notes                   | Allow users to remove notes they no longer need.                          |
        | Pin and View Favorite Notes    | Let users mark important notes as favorites and view them separately.     |
        | Search Notes by Keyword        | Enable users to quickly find notes by typing a search term.               |
        | Filter Notes by Category       | Let users organize and filter notes by custom categories.                 |
        | Edit Existing Notes            | Allow users to update the content of an existing note.                    |
        | Share Note Link                | Allow users to share a public link to a selected note.                    |

        ---

        ## ⚠️ Important Guidelines
        - **Only suggest user-visible functionalities.**
        - **Do not list tasks like "Setup database," "Implement API," "Add responsiveness," or "Improve UX."**
        - Ensure each suggested functionality represents a **clear working feature visible to the user.**
        - Limit the list to **10 features max per request.**

        ### Task Input:
        ${JSON.stringify(this.task)}

        ---
        `
    }

    async afterThought(thought: z.infer<typeof this.thoughtShape>): Promise<any> {
        const { tasks, comment } = thought

        this.task.leaveComment("Product Owner", comment)
        const taskPromises = []
        for (const task of tasks) {
            const t = Task.create('Product Owner', this.task.projectId, task.title, task.description)
            const taskPromise = this.taskRepository.save(t)
            taskPromises.push(taskPromise)
        }

        await Promise.all(taskPromises)
    }

}
