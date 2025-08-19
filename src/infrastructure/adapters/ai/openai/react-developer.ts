import z from "zod"
import { OpenAIContributor, Brain, ReasoningEffort } from "./contributor"
import { WorkUnit } from "@domain/value-objects/work-unit"
import { DevEnvironment } from "@domain/ports/services/dev-environment"
import { TaskRepository } from "@domain/ports/repositories/task-repository"

export class ReactDeveloper extends OpenAIContributor {
    
    name: string = "React Developer"

    brain = Brain.GPT_5

    reasoningEffort = ReasoningEffort.MEDIUM
    
    thoughtShape = z.object({
        sourceCode: z
            .object({})
            .catchall(z.string().describe("The source code (content) inside a file"))
            .describe("A map where each key is a file path and the value is the source code for that file"),
        comment: z.string().describe("The comment to be added to the task. It's a short summary of the changes you made from the user's perspective")
    })

    changeRequest!: WorkUnit
    localDevEnvironment: DevEnvironment
    taskRepository: TaskRepository
    MAX_RETRIES = 3

    constructor(localDevEnvironment: DevEnvironment, taskRepository: TaskRepository) {
        super()
        this.localDevEnvironment = localDevEnvironment
        this.taskRepository = taskRepository
    }


    async preThought(changeRequest: WorkUnit): Promise<any> {
        this.changeRequest = changeRequest
        this.changeRequest.task.startedWork("React Developer", "React Developer is generating the code...")
        await this.taskRepository.save(this.changeRequest.task)
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
                - Do not put technology names in the code. (e.g. "Application created using React, Tailwind CSS and Framer Motion...")
                - Do not use 'JigJoy' in the code. (e.g. "JigJoy Blog, Application created using JigJoy, etc..."), but keep the JigJoy meta tags in the index.html file, except user request change of meta tags.
    
                ### **Details**
                - **Current Source Code:** ${JSON.stringify(this.changeRequest.sourceCode)}
    
        `
    }
    
    async afterThought(tought: z.infer<typeof this.thoughtShape>): Promise<WorkUnit> {
        console.log("Writing code")

        const { sourceCode, comment } = tought

        this.changeRequest.task.leaveComment("React Developer", comment)
        this.changeRequest.task.finishedWork("React Developer", "Finished with coding")

        this.changeRequest.sourceCode = { ...this.changeRequest.sourceCode, ...sourceCode }

        try {
            this.changeRequest.task.startedWork("React Developer", "Building the project...")
            const buildArtifact = await this.localDevEnvironment.build(this.changeRequest.sourceCode)
            this.changeRequest.task.finishedWork("React Developer", "Build successful — check Output tab to test.")
            this.changeRequest.buildArtifact = buildArtifact
        } catch (error) {
            this.changeRequest.task.leaveComment("React Developer", `Error during build: ${error}` )
            this.changeRequest.task.finishedWork("React Developer", "Finsihed with error. Please create a new task with the bug description.")
        }finally{
            await this.taskRepository.save(this.changeRequest.task)
        }
        

        return this.changeRequest

    }


    
}