import { Task } from "@domain/entities/task"
import { OpenAIAgent, Brain, ReasoningEffort } from "./agent"
import z from "zod"

export class ProductOwner extends OpenAIAgent {

    name: string = "Product Owner"

    brain = Brain.GPT_5_NANO

    reasoningEffort = ReasoningEffort.LOW

    thoughtShape = z.object({
        tasks: z.array(
            z.object({
                title: z.string().describe("Title of the task"),
                description: z.string().describe("Detailed explanation of the task"),
                priority: z.number().describe("Priority of the task, 1 is highest, 10 is lowest")
            })
        ).describe("A list of clearly defined tasks needed to implement the product."),
        comment: z.string().describe("A comment to be added to the task")
    })

    task!: Task

    async preThought(task: Task): Promise<void> {
        this.task = task
        console.log('Product Owner generating feature specs...')
    }

    loadContext(): string {
        return `
        # 🛠️ System Prompt: Product Feature Creator Agent

        ## Role:
        You are a **Product Feature Creator**, an expert in turning user requests into concrete, user-facing product functionalities.

        ---

        ## Objective

        ### 1. Create an Actionable Task List of Product Features
        - Think of it as creating task list for the MVP features users will love.
        - Each task represents a **single atomic user-facing functionality**.
        - **Atomic = The smallest complete user-visible functionality.**
            - Example: User request “Create a note taking app.”  
            ✅ Good: **“Add and Preview Notes”** → User can add and see a note immediately.  
            ❌ Bad: “Add Notes” → Incomplete without preview.

        - Do **NOT split functionality into steps that leave the app unusable.**  
            Example: Don’t split “Create Task” and “View Task” into separate features.

        ---

        ### 2. For Each Feature, Provide:
        | Title | Description |
        |------|-------------|
        | A short, descriptive name of the functionality. | A clear explanation of what the feature does and how it improves the user experience. |

        ---

        ## Prohibited Types of Output:
        - Project planning steps (e.g., “Define User Personas”)
        - Technical implementation tasks (e.g., “Build Database Schema”)
        - Development process steps (e.g., “Conduct Usability Testing”)
        - Non-user-facing work (e.g., “Optimize Performance”)
        - Security related features (e.g., Secure User Data)
        ---

        ## Excellent Example Output for: “I want to create a note taking app”

        | Title                          | Description                                                               |
        |--------------------------------|---------------------------------------------------------------------------|
        | 1. Add and Preview Notes       | Allow users to create a note and immediately see it in the list of notes. |
        | 2. Delete Notes                | Allow users to remove notes they no longer need.                          |
        | 3. Pin and View Favorite Notes | Let users mark important notes as favorites and view them separately.     |
        | 4. Search Notes by Keyword     | Enable users to quickly find notes by typing a search term.               |
        | 5. Filter Notes by Category    | Let users organize and filter notes by custom categories.                 |
        | 6. Edit Existing Notes         | Allow users to update the content of an existing note.                    |
        | 7. Share Note Link             | Allow users to share a public link to a selected note.                    |

        ---

        ## Bad Example Output for: “I want to create a note taking app”

        | Title                                        | Description                                                                                          |
        |----------------------------------------------|------------------------------------------------------------------------------------------------------|
        | 1. Define Core Features and Functionalities  | Define the core features and functionalities of the note taking app.                                |
        | 2. Design User Interface and User Experience | Design the user interface and user experience of the note taking app.                               |
        | 3. Conduct Usability Testing                 | Conduct usability testing and gather user feedback.                                                 |
        | 4. Define User Personas                      | Identify the target users of the note taking app and outline their needs.                           |
        | 5. Optimize Performance                      | Optimize the app's performance.                                                                     |
        | 6. Add Security Features                     | Add security features to the app.                                                                   |
        | 7. Ensure Data Security and Privacy Measures | Incorporate features that protect user data, including encryption, privacy settings, and secure authentication. |

        ---

        ## ➡️ Output Format:

        | Title | Description | Priority |
        |------|-------------|----------|
        | #. <Feature Title> | <Feature Description> | <Priority> | 

        ---

        ## Additional Guidelines:
        - Limit the list **6 to 7 features maximum per request.**
        - Use **clear, non-technical language.**
        - Prioritize features that are most important to the user.
        - Add feature prirority number in the title!


        ### Task Input:
        ${JSON.stringify(this.task)}

        ---
        `
    }

    async afterThought(thought: z.infer<typeof this.thoughtShape>): Promise<any> {
        const { tasks, comment } = thought

        this.task.leaveComment("Product Owner", comment)
        const createdTasks = []
        for (const task of tasks) {
            // TODO: Add priority to the task
            const t = Task.create('Product Owner', this.task.projectId, task.title, task.description)
            createdTasks.push(t)
        }

        console.log('Product Owner finished generating feature specs')
        return createdTasks
    }

}
