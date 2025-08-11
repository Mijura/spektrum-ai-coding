import { Task } from "@domain/entities/task"
import { TaskRepository } from "@domain/ports/repositories/task-repository"
import { TaskExecutionRepository } from "@domain/ports/repositories/task-execution-repository"
import z from "zod"
import { OpenAIContributor, Brain } from "./contributor"
import { FileArtifacts } from "@domain/value-objects/file-artifacts"
import { WorkUnit } from "@domain/value-objects/work-unit"

export class GraphicDesigner extends OpenAIContributor {

    name: string = "Graphic Designer"

    brain = Brain.GPT_5_MINI

    thoughtShape = z.object({
        indexCss: z.string().describe("The full content of the index.css file with Tailwind directives and custom styles."),
        comment: z.string().describe("The comment to be added to the task. Detail design explanation for the user."),
        tailwindConfig: z.string().describe("The full content of the tailwind.config.js file with Tailwind directives and custom styles.")
    })

    taskRepository: TaskRepository
    taskExecutionRepository: TaskExecutionRepository
    task!: Task
    sourceCode!: FileArtifacts
    constructor(taskRepository: TaskRepository, taskExecutionRepository: TaskExecutionRepository) {
        super()
        this.taskRepository = taskRepository
        this.taskExecutionRepository = taskExecutionRepository
    }

    async preThought({task, sourceCode}: WorkUnit): Promise<any> {
        this.task = task
        this.sourceCode = sourceCode
        this.task.startedWork("Graphic Designer", "Graphic Designer is generating the new styles and layout...")
    }

    loadContext(): string {
        return `### Role:
            You are an expert UI/UX Designer working on a React project with Tailwind CSS, Framer Motion, and lucide-react icons library.
    
            Your guiding design principles:

            ## Accessibility
            - Pay attention to the color contrast and accessibility of the design.

            ### **Your Tasks:**

            1. Maintain index.css 
               - Define Tailwind CSS class combinations and reusable CSS utility classes (in index.css):
               - Provide Tailwind classes for layout & styling of each section/component (e.g., Hero Section, Button, Card, Footer).
               - When appropriate, create custom utility classes in the index.css file (e.g., .btn-primary, .layout-hero, .card-sm, etc.).
               - Don't add color classes to the index.css, but use the tailwind.config.js file to define the colors.

            2. Maintain tailwind.config.js
                - All colors and other tailwind classes must be defined in the tailwind.config.js file.

            3. Provide **clear feedback to user** which classes to use for each part of the requested feature.  
               Example:
               - Use \`btn-primary\` for the **Add New Note** button.
               - Use \`layout-wrapper\` to arrange the page layout.
               - Use \`input-sm\` for note titles.

            4. Do not ask the user about next steps, just provide the classes and the comment.

            ### **User Request (Task):**
            ${JSON.stringify(this.task)}

            ### **Current index.css:** 
            ${this.sourceCode?.["src/index.css"] ?? "(empty)"}

            ### **Current tailwind.config.js:**
            ${this.sourceCode?.["tailwind.config.js"] ?? "(empty)"}

        `
    }

    async afterThought(tought: z.infer<typeof this.thoughtShape>): Promise<any> {
        const { indexCss, comment, tailwindConfig } = tought

        this.task.finishedWork("Graphic Designer", "Graphic Designer has finished the design generation...")

        this.sourceCode = {
            ...this.sourceCode,
            "src/index.css": indexCss,
            "tailwind.config.js": tailwindConfig
        }

        this.task.leaveComment("Graphic Designer", comment)


        console.log("Passing task to React Developer")
        return await this.delegateTo("React Developer", {task: this.task, sourceCode: this.sourceCode})
    }

}