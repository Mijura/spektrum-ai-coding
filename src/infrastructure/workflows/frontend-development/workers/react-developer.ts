import { Project } from "@domain/entities/project"
import { Task } from "@domain/entities/task"
import { FrontendDevelopmentService } from "@domain/ports/frontend-development"
import { ProjectRepository } from "@domain/repositories/project-repository"
import { TaskRepository } from "@domain/repositories/task-repository"
import { TaskExecutionRepository } from "@domain/repositories/task-execution-repository"
import { SourceCode } from "@domain/types/source-code"
import { Brain, Contributor } from "@honeycomb-app/hexacore"
import z from "zod"

export class ReactDeveloper extends Contributor {
    
    name: string = "React Developer"

    brain = Brain.GPT_41
    
    thoughtShape = z.object({
        sourceCode: z
            .object({})
            .catchall(z.string().describe("The source code (content) inside a file"))
            .describe("A map where each key is a file path and the value is the source code for that file"),
        comment: z.string().describe("The comment to be added to the task. It's a short summary of the changes you made from the user's perspective")
    })

    frontendDevelopmentService: FrontendDevelopmentService
    projectRepository: ProjectRepository
    taskRepository: TaskRepository
    taskExecutionRepository: TaskExecutionRepository
    task!: Task
    project!: Project
    private retryCount: number = 0
    private readonly MAX_RETRIES: number = 4

    constructor(frontendDevelopmentService: FrontendDevelopmentService, projectRepository: ProjectRepository, taskRepository: TaskRepository, taskExecutionRepository: TaskExecutionRepository) {
        super();
        this.frontendDevelopmentService = frontendDevelopmentService
        this.projectRepository = projectRepository
        this.taskRepository = taskRepository
        this.taskExecutionRepository = taskExecutionRepository

    }

    async preThought(task: Task): Promise<any> {
        this.task = task
        this.task.startedWork("React Developer", "React Developer is generating the code...")
        this.project = await this.projectRepository.get(this.task.projectId)
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
        this.task.startedWork("React Developer", "React developer deploying the application...")

        await this.frontendDevelopmentService.restoreSourceCode(this.project)
        const wholeCode = await this.frontendDevelopmentService.updateSourceCode(this.task.projectId, sourceCode)

        try {
            await this.frontendDevelopmentService.installDependencies(this.task.projectId)
            await this.frontendDevelopmentService.buildProject(this.task.projectId)
        } catch (error) {
            this.retryCount++
            
            if (this.retryCount >= this.MAX_RETRIES) {
                this.task.leaveComment("React Developer", `Failed to resolve the issue after ${this.MAX_RETRIES} attempts. Error: ${error}.`)
                this.task.finishedWork("React Developer", "Failed after maximum retry attempts")
                throw new Error(`Maximum retry attempts (${this.MAX_RETRIES}) exceeded. Last error: ${error}`)
            }

            this.task.leaveComment("React Developer", `Attempt ${this.retryCount}/${this.MAX_RETRIES}: I encountered an error during build: ${error}. Retrying with a different approach...`)            
            this.task.finishedWork("React Developer", "Failed to build the application")
            return this.execute(this.task)
        } finally {
            this.task.finishedWork("React Developer", "Finished updating the application")
            await this.taskRepository.save(this.task)
        }

        await this.frontendDevelopmentService.deployToDevEnvironment(this.task.projectId)
        //await this.frontendDevelopmentService.removeSourceCodeFromFileSystem(this.task.projectId)
        this.task.leaveComment("React Developer", "Application is successfully deployed and now is ready to be tested.")
        this.project.setArtifact(wholeCode)
        await this.projectRepository.save(this.project)
        return sourceCode

    }


    
}