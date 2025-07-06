import { Project } from "@domain/entities/project"
import { Task } from "@domain/entities/task"
import { FrontendDevelopmentService } from "@domain/ports/frontend-development"
import { ProjectRepository } from "@domain/repositories/project-repository"
import { TaskRepository } from "@domain/repositories/task-repository"
import { WorkflowRunRepository } from "@domain/repositories/workflow-run-repository"
import { SourceCode } from "@domain/types/source-code"
import { Brain, Contributor } from "@honeycomb-app/hexacore"
import z from "zod"

export class ReactDeveloper extends Contributor {
    
    name: string = "React Developer"

    brain = Brain.GPT_41_MINI
    
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
    workflowRunRepository: WorkflowRunRepository
    task!: Task
    project!: Project
    designGuidelines: any

    constructor(frontendDevelopmentService: FrontendDevelopmentService, projectRepository: ProjectRepository, taskRepository: TaskRepository, workflowRunRepository: WorkflowRunRepository) {
        super();
        this.frontendDevelopmentService = frontendDevelopmentService
        this.projectRepository = projectRepository
        this.taskRepository = taskRepository
        this.workflowRunRepository = workflowRunRepository

    }

    async preThought(design: any): Promise<any> {
        this.task = design.task
        this.designGuidelines = design.guidelines
        this.task.startedWork("React Developer", "Code Generation", "React Developer is generating the code...")
        this.project = await this.projectRepository.findById(this.task.projectId)
    }

    loadContext(): string {

        return `### Role:
            You are an React Frontend Developer working on React project with Tailwind CSS and Framer Motion. 
    
            ### **Your Tasks:**

                1. **Modify or create new files according the latest plan from the Product Owner**:
                - When create a new feature, you should create a reusable components in the separate files.
                - You should use the components in the src/components/ui folder to develop new features.

                **Task with plan:**
                ${JSON.stringify(this.task)}

                **Design Guidelines:**
                ${JSON.stringify(this.designGuidelines)}

                MOST IMPORTANT:
                - Update package.json if you plan to import new dependencies. (e.g. "chart.js" should be added to the dependencies)
                - Always use suggested classes from the design guidelines, except something is not mentioned in the design guidelines.
    
                ### **Details**
                - **Current Source Code:** ${JSON.stringify(this.project.artifact)}
    
        `
    }
    
    async afterThought(tought: z.infer<typeof this.thoughtShape>): Promise<SourceCode> {
        console.log("Writing code")

        const { sourceCode, comment } = tought

        this.task.finishedWork("React Developer", "Code Generation", "Finished with coding")
        this.task.leaveComment("React Developer", comment)
        this.task.startedWork("React Developer", "Code Deployment", "React developer deploying the application...")

        try {

            await this.frontendDevelopmentService.restoreSourceCode(this.project)
            const wholeCode = await this.frontendDevelopmentService.updateSourceCode(this.task.projectId, sourceCode)
            await this.frontendDevelopmentService.installDependencies(this.task.projectId)
            await this.frontendDevelopmentService.buildProject(this.task.projectId)
            await this.frontendDevelopmentService.deployToDevEnvironment(this.task.projectId)
            //await this.frontendDevelopmentService.removeSourceCodeFromFileSystem(this.task.projectId)
            this.task.leaveComment("React Developer", "Application is successfully deployed and now is ready to be tested.")
            this.project.setArtifact(wholeCode)
            await this.projectRepository.save(this.project)
            return sourceCode
        } catch (error) {
            console.error("Error writing files:", error)
            this.task.leaveComment("React Developer", "I encountered an error during build : " + error)
            throw error
        } finally {
            this.task.finishedWork("React Developer", "Code Deployment", "Finished updating the application")
            await this.taskRepository.save(this.task)
        }

    }


    
}