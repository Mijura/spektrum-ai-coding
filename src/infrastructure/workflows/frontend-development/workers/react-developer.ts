import { Project } from "@domain/entities/project";
import { Task } from "@domain/entities/task";
import { FrontendDevelopmentService } from "@domain/ports/frontend-development";
import { ProjectRepository } from "@domain/repositories/project-repository";
import { TaskRepository } from "@domain/repositories/task-repository";
import { WorkflowRunRepository } from "@domain/repositories/workflow-run-repository";
import { AIWorker, Brain } from "@infrastructure/workflows/ai-worker";
import z from "zod"; 

export class ReactDeveloper extends AIWorker {

    
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
    task: Task;
    project!: Project;

    constructor(frontendDevelopmentService: FrontendDevelopmentService, projectRepository: ProjectRepository, taskRepository: TaskRepository, workflowRunRepository: WorkflowRunRepository, task: Task) {
        super();
        this.frontendDevelopmentService = frontendDevelopmentService
        this.projectRepository = projectRepository
        this.taskRepository = taskRepository
        this.workflowRunRepository = workflowRunRepository
        this.task = task

    }
    async preThought(task:Task): Promise<any> {
        task.startedWork("React Developer", "Code Generation", "React Developer is generating the code...")
        this.project = await this.projectRepository.findById(task.projectId)
    }

    loadContext(): string {

        const task = JSON.stringify(this.task)

        return `### Role:
            You are an React Frontend Developer working on React project with Tailwind CSS and Framer Motion. 
    
            ### **Your Tasks:**
                1. ** Analyze task details, activities, and comments." Figure out what should be done to resolve the task.
                    ** You can recognize your prior activities by author name 'React Developer' **
                
                ****Analyze the current source code** to determine if the required functionality already exists.
                - If the functionality exists, modify it as needed.
                - If the functionality does not exist, create new components, hooks, or utilities as required.
                
                2. **Modify or create source files as needed**:
                - Create new components, hooks, or utilities as required.
    
                3. ** Create a reusable components in the src/components folder if needed**:
                - Create a reusable components in the separate files.
                - Use the components in the source code.

                4. **If you are using a new dependency, you should add it to the package.json file.**:
                - For example, if you are using react-hook-form, you should add it to the package.json file.
                - NOTE: If you don't add the dependency to the package.json file, the project will not work.
    
                ### **Details**
                - **Task Details:** ${task}
                - **Current Source Code:** ${JSON.stringify(this.project.artifact)}
    
                Important:
                - Double check all imports or require statements to ensure they are listed in the package.json file.
                - Respond only in valid JSON. The JSON object you return should match the following schema.

                ### **Output Format**
                ${JSON.stringify(this.thoughtShape.shape)}
        `
    }
    
    async afterThought(tought: z.infer<typeof this.thoughtShape>): Promise<any> {
        console.log("Writing code")

        const { sourceCode, comment } = tought

        this.task.finishedWork("React Developer", "Code Generation", "Finished with coding")
        this.task.leaveComment("React Developer", comment)

        this.task.startedWork("React Engineer", "Code Deployment", "React engineer deploying the application...")

        try {

            await this.frontendDevelopmentService.restoreProject(this.project)
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
            this.task.finishedWork("React Engineer", "Code Deployment", "Finished updating the application")
            await this.taskRepository.save(this.task)
        }

    }


    
}