import { Project } from "@domain/entities/project"
import { Task } from "@domain/entities/task"
import { FrontendDevelopmentService } from "@domain/ports/frontend-development"
import { ProjectRepository } from "@domain/repositories/project-repository"
import { TaskRepository } from "@domain/repositories/task-repository"
import { WorkflowRunRepository } from "@domain/repositories/workflow-run-repository"
import { Brain, Contributor } from "@honeycomb-app/hexacore"
import z from "zod"

export class GraphicDesigner extends Contributor {

    name: string = "Graphic Designer"

    brain = Brain.GPT_41_MINI

    thoughtShape = z.object({
        indexCss: z.string().describe("The full content of the index.css file with Tailwind directives and custom styles."),
        guidelines: z.array(z.string()).describe("A list of concrete recommendations: which class to use for each part of the feature (e.g., buttons, layouts, inputs, cards)."),
        //comment: z.string().describe("The comment to be added to the task. It's a short summary of the changes you made from the user's perspective")
    })

    frontendDevelopmentService: FrontendDevelopmentService
    projectRepository: ProjectRepository
    taskRepository: TaskRepository
    task!: Task
    project!: Project

    constructor(frontendDevelopmentService: FrontendDevelopmentService, projectRepository: ProjectRepository, taskRepository: TaskRepository, workflowRunRepository: WorkflowRunRepository) {
        super()
        this.frontendDevelopmentService = frontendDevelopmentService
        this.projectRepository = projectRepository
        this.taskRepository = taskRepository
    }

    async preThought(task: Task): Promise<any> {
        this.task = task
        this.task.startedWork("Graphic Designer", "Design Generation", "Graphic Designer is generating the new styles and layout...")
        this.project = await this.projectRepository.findById(task.projectId)
    }

    loadContext(): string {
        return `### Role:
            You are a Graphic Designer specializing in Tailwind CSS. 
    
            ### **Your Tasks:**

            1. Generate or update the complete **index.css** file:
               - Start with \`@tailwind base;\`, \`@tailwind components;\`, and \`@tailwind utilities;\`.
               - Add unique custom utility classes favoring **very small, compact UI elements** with thoughtful shades and spacing.
               - Be creative unless the user explicitly asks for specific styling.
               - Generate reusable classes like \`.btn-primary\`, \`.layout-wrapper\`, \`.input-sm\`, \`.card-sm\`.

            2. Provide **clear instructions to developers** which classes to use for each part of the requested feature.  
               Example:
               - Use \`btn-primary\` for the **Add New Note** button.
               - Use \`layout-wrapper\` to arrange the page layout.
               - Use \`input-sm\` for note titles.

            ### **MOST IMPORTANT**
            - Favor compact designs (text-xs, p-1, gap-1, rounded-sm).
            - Use subtle color shades (gray-100, gray-200, blue-100), not harsh contrasts unless asked.
            - Do **not explain your thinking process**, only provide the **concrete class definitions** and the **guidelines**.

            ### **User Request (Task):**
            ${JSON.stringify(this.task)}

            ### **Current index.css:** 
            ${this.project.artifact?.["src/index.css"] ?? "(empty)"}

        `
    }

    async afterThought(tought: z.infer<typeof this.thoughtShape>): Promise<any> {
        const { indexCss, guidelines } = tought

        this.task.leaveComment("Graphic Designer", "Design Guidelines:")
        this.task.leaveComment("Graphic Designer", guidelines.join("\n"))

        console.log("Passing task to React Developer")
        await this.frontendDevelopmentService.updateSourceCode(this.project.id, {
            "src/index.css": indexCss,
        })
        return await this.delegateTo("React Developer", this.task)
    }

}
