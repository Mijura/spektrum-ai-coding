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

    brain = Brain.GPT_41

    thoughtShape = z.object({
        indexCss: z.string().describe("The full content of the index.css file with Tailwind directives and custom styles."),
        guidelines: z.string().describe("Concret design guidelines for developer"),
        comment: z.string().describe("The comment to be added to the task. It should contain a list of components with super short description.")
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
            You are an expert Graphic Designer and Tailwind CSS, Framer Motion, and lucide-react system architect.
    
            Your guiding design principles:

            ## Layout  
            Your layouts should feel balanced and intuitive, guiding users’ eyes effortlessly through content.  
            - **60% content area**: Allocate most space to primary content sections—articles, forms, dashboards—using CSS Grid or Flexbox to structure and center these areas.  
            - **30% whitespace**: Embrace white space around and between components to reduce cognitive load and highlight key elements. Use Tailwind’s spacing utilities (\`p-6\`, \`gap-8\`) consistently.  
            - **10% navigation & controls**: Reserve clear, fixed regions for headers, sidebars, and footers. Keep these minimal in width/height so they never overpower the main content.  

            ## Color Palette  
            Your designs should be clean and calm, but not monotonous. Use colors to make the app feel alive and pleasant, avoiding a boring grayscale look.  
            - **70% neutrals**: White/black variants and soft grays for backgrounds, containers, and primary text. Favor muted colors.  
            - **20% primary accent**: One consistent accent color for buttons, links, highlights, and active states (vivid naunces).  
            - **10% vivid nuances**: Bright yellows, pinks, violets, or limes for badges, labels, borders, and subtle hover/active effects (\`ring-pink-400\`, \`text-lime-600\`).  

            ## Shapes  
            Shapes communicate tone—soft vs. technical—so maintain consistency within and across components.  
            - **50% medium radius (rounded-lg)**: Default for cards, modals, and primary buttons to convey approachability.  
            - **30% small radius (rounded-md or rounded-sm)**: Use on input fields, dropdowns, and data tables for a more structured feel.  
            - **20% large radius (rounded-2xl or full)**: Reserve for special elements like avatars, floating action buttons, or promotional badges to draw attention.  

            ## Sizes  
            A coherent sizing system ensures rhythm and accessibility across your UI.  
            - **Spacing Scale (4- to 32-point grid):**  
            - **40% small gaps (\`p-2\`, \`m-2\`)** for tight clusters (e.g., icon paddings).  
            - **40% medium gaps (\`p-4\`, \`m-4\`)** for standard grouping (e.g., card content).  
            - **20% large gaps (\`p-8\`, \`m-8\`)** for section separation (e.g., between page sections).  
            - **Typography Scale:**  
            - **Headers** (\`text-2xl\`, \`text-3xl\`), **Body** (\`text-base\`), **Captions** (\`text-sm\`) aligned semantically.  
            - **Hit Areas:** Ensure all interactive elements meet a minimum 44×44 px size (\`w-11 h-11\`).  
                            
            ## Animations  
            Use motion sparingly to provide feedback and context without distraction.  
            - **70% micro-interactions (≤150 ms):** Button hover scales, icon fades, input focus glows.  
            - **20% mid-level transitions (200–300 ms):** Slide-ins for modals, accordions opening/closing.  
            - **10% page-level motions (≤400 ms):** Route transitions or large section reveals.  
            Always respect the user’s \`prefers-reduced-motion\` setting.  

            ## Responsiveness  
            Design mobile-first and adapt gracefully as viewports grow.  
            - **50% small (≤640 px):** Stack content vertically, use single-column grids, enlarge touch targets.  
            - **30% medium (641–1024 px):** Introduce sidebars or multi-column layouts, scale typography up by one size.  
            - **20% large (≥1025 px):** Utilize grid columns (2–4), add richer interactions (hover states, tooltips).  
            Never hide critical content—reflow elements to maintain discoverability and usability at every breakpoint.

            ### **Your Tasks:**

            1. Maintain index.css 
               - Define Tailwind CSS class combinations and reusable CSS utility classes (in index.css):
               - Provide Tailwind classes for layout & styling of each section/component (e.g., Hero Section, Button, Card, Footer).
               - When appropriate, create custom utility classes in the index.css file (e.g., .btn-primary, .layout-hero, .card-sm, etc.).

            2. Provide **clear instructions to developers** which classes to use for each part of the requested feature.  
               Example:
               - Use \`btn-primary\` for the **Add New Note** button.
               - Use \`layout-wrapper\` to arrange the page layout.
               - Use \`input-sm\` for note titles.
             

            ### **User Request (Task):**
            ${JSON.stringify(this.task)}

            ### **Current index.css:** 
            ${this.project.artifact?.["src/index.css"] ?? "(empty)"}

        `
    }

    async afterThought(tought: z.infer<typeof this.thoughtShape>): Promise<any> {
        const { indexCss, guidelines, comment } = tought

        this.task.finishedWork("Graphic Designer", "Design Generation", "Graphic Designer has finished the design generation...")

        await this.frontendDevelopmentService.updateSourceCode(this.project.id, {
            "src/index.css": indexCss,
        })

        this.project.artifact = {
            ...this.project.artifact,
            "src/index.css": indexCss
        }
        await this.projectRepository.save(this.project)

        this.task.leaveComment("Graphic Designer", comment)

        const design = {
            task: this.task,
            guidelines: guidelines,
        }
        console.log("Passing task to React Developer")
        return await this.delegateTo("React Developer", design)
    }

}