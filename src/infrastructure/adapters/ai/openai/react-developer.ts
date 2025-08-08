import { FileArtifacts } from "@domain/value-objects/file-artifacts"
import z from "zod"
import { OpenAIContributor, Brain } from "./contributor"
import { ChangeRequest } from "@domain/value-objects/change-request"

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

    changeRequest!: ChangeRequest


    async preThought(changeRequest: ChangeRequest): Promise<any> {
        this.changeRequest = changeRequest
        this.changeRequest.task.startedWork("React Developer", "React Developer is generating the code...")
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
                ${JSON.stringify(this.changeRequest.task)}

                MOST IMPORTANT:
                - Update package.json if you plan to import new dependencies. (e.g. "chart.js" should be added to the dependencies)
                - Always use classes from the index.css and tailwind.config.js files.
    
                ### **Details**
                - **Current Source Code:** ${JSON.stringify(this.changeRequest.sourceCode)}
    
        `
    }
    
    async afterThought(tought: z.infer<typeof this.thoughtShape>): Promise<FileArtifacts> {
        console.log("Writing code")

        const { sourceCode, comment } = tought

        this.changeRequest.task.finishedWork("React Developer", "Finished with coding")
        this.changeRequest.task.leaveComment("React Developer", comment)

        console.log("Writing code", sourceCode)

        return sourceCode

    }


    
}