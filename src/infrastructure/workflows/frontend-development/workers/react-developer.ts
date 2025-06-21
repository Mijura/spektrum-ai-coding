import { Project } from "@domain/entities/project"
import { Task } from "@domain/entities/task"
import { FrontendDevelopmentService } from "@domain/ports/frontend-development"
import { ProjectRepository } from "@domain/repositories/project-repository"
import { TaskRepository } from "@domain/repositories/task-repository"
import { WorkflowRunRepository } from "@domain/repositories/workflow-run-repository"
import { SourceCode } from "@domain/types/source-code"
import { Contributor, Brain } from "@infrastructure/workflows/contributor"
import z from "zod"

export class ReactDeveloper extends Contributor {
    
    name: string = "React Developer"

    brain = Brain.GPT_41_MINI;
    
    thoughtShape = z.object({
        sourceCode: z.record(
            z.string().describe("The file path as a string"),
            z.string().describe("The source code (content) inside a file")
        ),
        comment: z.string().describe("The comment to be added to the task. It's a short summary of the changes you made from the user's perspective")
    })

    frontendDevelopmentService: FrontendDevelopmentService
    projectRepository: ProjectRepository
    taskRepository: TaskRepository
    workflowRunRepository: WorkflowRunRepository
    task!: Task;
    project!: Project;

    constructor(frontendDevelopmentService: FrontendDevelopmentService, projectRepository: ProjectRepository, taskRepository: TaskRepository, workflowRunRepository: WorkflowRunRepository) {
        super();
        this.frontendDevelopmentService = frontendDevelopmentService
        this.projectRepository = projectRepository
        this.taskRepository = taskRepository
        this.workflowRunRepository = workflowRunRepository

    }

    async preThought(task: Task): Promise<any> {
        this.task = task
        this.task.startedWork("React Developer", "Code Generation", "React Developer is generating the code...")
        this.project = await this.projectRepository.findById(task.projectId)
    }

    loadContext(): string {

        return `### Role:
            You are an React Frontend Developer working on React project with Tailwind CSS and Framer Motion. 
    
            ### **Your Tasks:**
                1. ** Analyze task details, activities, and comments to figure out what should be done to resolve the task.
                - You can recognize your prior activities by author name 'React Developer'
                - **Task details:** ${JSON.stringify(this.task)}
                
                2. After you understand the task, create a extensive plan of the changes you will make.
                - Research over the internet to find the best solution for the task.
                - If the user request landing page, deeply research over the internet whats end user expect from the landing page.
                - If the user request dashboard, deeply research over the internet whats end user expect from the dashboard.
                - If the user request admin panel, deeply research over the internet whats end user expect from the admin panel.

                3. **Modify or create new files according to the plan**:
                - Use the components in the src/components/ui folder to develop new features.
                - When create a new feature, you should create a reusable components in the separate files.

                4. **If you are using a new dependency, you should add it to the package.json file.**:
                - For example, if you are using react-hook-form, you should add it to the package.json file.
                - NOTE: If you don't add the dependency to the package.json file, the project will not work.
    
                ### **Details**
                - **Current Source Code:** ${JSON.stringify(this.project.artifact)}
    
                Important:
                - Double check all imports or require statements to ensure they are listed in the package.json file.
                - Respond only in valid JSON. The JSON object you return should match the following schema.

                ### **Output Format**
                ${JSON.stringify(this.thoughtShape.shape)}
        `
    }
    
    async afterThought(tought: z.infer<typeof this.thoughtShape>): Promise<SourceCode> {
        console.log("Writing code")

        const { sourceCode, comment } = tought

        this.task.finishedWork("React Developer", "Code Generation", "Finished with coding")
        this.task.leaveComment("React Developer", comment)
        this.task.startedWork("React Developer", "Code Deployment", "React engineer deploying the application...")

        try {

            await this.frontendDevelopmentService.restoreSourceCode(this.project)
            const wholeCode = await this.frontendDevelopmentService.updateSourceCode(this.task.projectId, sourceCode)
            await this.frontendDevelopmentService.installDependencies(this.task.projectId)
            await this.frontendDevelopmentService.buildProject(this.task.projectId)
            await this.frontendDevelopmentService.deployToDevEnvironment(this.task.projectId)
            await this.frontendDevelopmentService.removeSourceCodeFromFileSystem(this.task.projectId)
            this.task.leaveComment("React Engineer", "Application is successfully deployed and now is ready to be tested.")
            this.project.setArtifact(wholeCode)
            await this.projectRepository.save(this.project)
            return sourceCode
        } catch (error) {
            console.error("Error writing files:", error)
            this.task.leaveComment("React Engineer", "I encountered an error during build : " + error)
            throw error
        } finally {
            this.task.finishedWork("React Developer", "Code Deployment", "Finished updating the application")
            await this.taskRepository.save(this.task)
        }

    }


    
}
