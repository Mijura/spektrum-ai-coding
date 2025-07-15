import { Task } from "@domain/entities/task"
import { SourceCode } from "@domain/types/source-code"
import z from "zod"
import { OpenAIContributor, Brain } from "./contributor"

export class ReactDeveloper extends OpenAIContributor {
    
    name: string = "React Developer"

    brain = Brain.GPT_41
    
    thoughtShape = z.object({
        sourceCode: z
            .object({})
            .catchall(z.string().describe("The source code (content) inside a file"))
            .describe("A map where each key is a file path and the value is the source code for that file"),
        comment: z.string().describe("The comment to be added to the task. It's a short summary of the changes you made from the user's perspective")
    })

    task!: Task


    async preThought(task: Task): Promise<any> {
        this.task = task
        this.task.startedWork("React Developer", "React Developer is generating the code...")
    }

    loadContext(): string {

        return `### Role:
            You are an React Frontend Developer working on React project with Tailwind CSS and Framer Motion. 
    
            ### **Your Tasks:**

                1. **Modify or create new files according the task description and activities**:
                - When create a new feature, you should create a reusable components in the separate files.
                - You should use the components in the src/components/ui folder to develop new features.
                - You should keep all previous features visible and working.
                - When new feature is requested, you should ensure that its visible to the user, along with all previous features.

                **Task with plan:**
                ${JSON.stringify(this.task)}

                MOST IMPORTANT:
                - Update package.json if you plan to import new dependencies. (e.g. "chart.js" should be added to the dependencies)
                - Always use classes from the index.css and tailwind.config.js files.
    
                ### **Details**
                - **Current Source Code:** ${JSON.stringify(this.project.artifact)}
    
        `
    }
    
    async afterThought(tought: z.infer<typeof this.thoughtShape>): Promise<SourceCode> {
        console.log("Writing code")

        const { sourceCode, comment } = tought

        this.task.finishedWork("React Developer", "Finished with coding")
        this.task.leaveComment("React Developer", comment)

        return sourceCode

    }


    
}