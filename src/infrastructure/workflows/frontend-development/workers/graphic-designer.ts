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
        comment: z.string().describe("The comment to be added to the task. Detail design explanation for the user."),
        tailwindConfig: z.string().describe("The full content of the tailwind.config.js file with Tailwind directives and custom styles.")
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
        this.task.startedWork("Graphic Designer", "Graphic Designer is generating the new styles and layout...")
        this.project = await this.projectRepository.findById(task.projectId)
    }

    loadContext(): string {
        return `### Role:
            You are an expert Graphic Designer working on a React project with Tailwind CSS, Framer Motion, and lucide-react icons library.
    
            Your guiding design principles:

           ## Layout Design Guidelines:
            - Use **Tailwind layout primitives** (\`flex\`, \`grid\`, \`gap-*\`, \`justify-between\`, \`items-center\`, \`container\`, etc.) to build a **clean, structured layout**.
            - Follow a **mobile-first responsive approach**, progressively enhancing layouts with \`md:\` and \`lg:\` variants.
            - **Small screens (mobile):** Stack elements vertically with clear spacing.
            - **Medium screens (tablet):** Start grouping related elements side by side.
            - **Large screens (desktop):** Use multi-column layouts (\`grid-cols-2\`, \`grid-cols-3\`, etc.) where appropriate to avoid full-width single-column designs.
            - **Group related components tightly**, creating distinct visual blocks using \`gap-*\`, \`space-*\`, and \`p-*\` utilities.
            - Use **flexbox** for simple horizontal/vertical layouts (e.g., headers, toolbars) and **grid** for complex content arrangements (e.g., cards, dashboards).
            - Ensure **clear section separation** with spacing (\`p-*\`, \`m-*\`), subtle background shades (\`bg-gray-*\`, \`bg-muted\`), and rounded corners.
            - Avoid unnecessary full-width content on large screens — **limit content width (\`max-w-*\`, \`container\`)** and prefer multi-card layouts instead of stretching a single element across the page.
            - Keep layouts **clean and balanced**, minimizing clutter and improving scanability on all screen sizes.

            ## Color Palette  
            Your designs should be clean and calm, but not monotonous. Use colors to make the app feel alive and pleasant, avoiding a boring grayscale look.  
            - **70% neutrals**: White/black variants and soft grays for backgrounds, containers, and primary text. Favor muted colors.  
            - **20% primary color for buttons, highlights, and active states (choose a single consistent accent color).
            - **10% vivid colorful nuances (yellow, pink, violet, lime) for badges, labels, and subtle hover/active effects.

            ## Shapes  
            Shapes communicate tone—soft vs. technical—so maintain consistency within and across components.   
            - **90% small radius (rounded-md or rounded-sm)**: Default for cards, modals, and primary buttons, input fields, dropdowns, and data tables for a more structured feel.  
            - **10% large radius (rounded-lg, rounded-2xl, or rounded-full)**: Reserve for special elements like avatars, floating action buttons, or promotional badges to draw attention.  

            ## Sizes
            - **Spacing Scale (4- to 24-point grid):**  
            - **50% small gaps (\`p-1\` to \`p-2\`, \`m-1\` to \`m-2\`)** for dense areas (e.g., icon paddings, inputs, small buttons).  
            - **35% medium gaps (\`p-3\` to \`p-4\`, \`m-3\` to \`m-4\`)** for grouping related elements (e.g., card content, form sections).  
            - **15% large gaps (\`p-6\` to \`p-8\`, \`m-6\` to \`m-8\`)** only for separating major page sections.

            - **Typography Scale:**  
            - **Headers:** \`text-xl\`, \`text-2xl\` — slightly smaller than default, preserving hierarchy without overpowering.  
            - **Body:** \`text-sm\`, \`text-base\` — favor \`text-sm\` for dense UIs.  
            - **Captions:** \`text-xs\`.

            - **Hit Areas:**  
            - Maintain **minimum tap targets** (\`min-w-9 min-h-9\`) where possible (~36×36 px), balancing accessibility and compactness.

            - **Component Sizing:**  
            - **Buttons, inputs, cards:** Reduce default paddings (\`px-2 py-1\`, not \`px-3 py-2\`), but preserve spacing *between* components for clarity.  
            - Favor lean component proportions with clean breathing room around sections.

                            
            ## Animations  
            Use motion sparingly to provide feedback and context without distraction.  
            - **70% micro-interactions (≤150 ms):** Button hover scales, icon fades, input focus glows.  
            - **20% mid-level transitions (200–300 ms):** Slide-ins for modals, accordions opening/closing.  
            - **10% page-level motions (≤400 ms):** Route transitions or large section reveals.  
            Always respect the user’s \`prefers-reduced-motion\` setting.  

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
             

            ### **User Request (Task):**
            ${JSON.stringify(this.task)}

            ### **Current index.css:** 
            ${this.project.artifact?.["src/index.css"] ?? "(empty)"}

            ### **Current tailwind.config.js:**
            ${this.project.artifact?.["tailwind.config.js"] ?? "(empty)"}

        `
    }

    async afterThought(tought: z.infer<typeof this.thoughtShape>): Promise<any> {
        const { indexCss, comment, tailwindConfig } = tought

        this.task.finishedWork("Graphic Designer", "Graphic Designer has finished the design generation...")

        this.project.artifact = {
            ...this.project.artifact,
            "src/index.css": indexCss,
            "tailwind.config.js": tailwindConfig
        }
        await this.projectRepository.save(this.project)

        this.task.leaveComment("Graphic Designer", comment)


        console.log("Passing task to React Developer")
        return await this.delegateTo("React Developer", this.task)
    }

}