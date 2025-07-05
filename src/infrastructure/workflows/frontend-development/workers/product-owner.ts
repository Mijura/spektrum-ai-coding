import { Task } from "@domain/entities/task"
import { TaskRepository } from "@domain/repositories/task-repository"
import { Contributor, Brain } from "@honeycomb-app/hexacore"
import z from "zod"

export class ProductOwner extends Contributor {

    name: string = "Product Owner"

    brain = Brain.GPT_41_NANO

    thoughtShape = z.object({
        tasks: z.array(
            z.object({
                title: z.string().describe("Title of the task"),
                description: z.string().describe("Detailed explanation of the task")
            })
        ).describe("A list of clearly defined tasks needed to implement the product."),
        comment: z.string().describe("A comment to be added to the task")
    })

    task!: Task
    taskRepository: TaskRepository

    constructor(taskRepository: TaskRepository) {
        super()
        this.taskRepository = taskRepository
    }

    async preThought(task: Task): Promise<void> {
        this.task = task
    }

    loadContext(): string {
        return `
        ### Role:
        You are a **Product Owner**, an expert in translating user requests into product deliverables.

        ### Your Objective:
        1. **Analyze the user’s request, activities, and comments.**
        - Focus on understanding the user's underlying needs and goals.
        - Do **not** ask the user or other contributors for clarification.
        - Avoid technical implementation details.

        2. **Break down the work into a task list:**
        - Create a detailed list of features that needs to be implemented to create a rich and engaging user experience.
        - For each task, write:
            - **Title:** A short and descriptive title.
            - **Description:** A clear explanation of the task and its goal.
        - Think like a Product Owner — focus on what needs to be done, not how it should be implemented.

        ---

        ### Task Input:
        ${JSON.stringify(this.task)}

        ---
        `
    }

    async afterThought(thought: z.infer<typeof this.thoughtShape>): Promise<any> {
        const { tasks, comment } = thought

        this.task.leaveComment("Product Owner", comment)
        const taskPromises = []
        for (const task of tasks) {
            const t = Task.create('Product Owner', this.task.projectId, task.title, task.description)
            const taskPromise = this.taskRepository.save(t)
            taskPromises.push(taskPromise)
        }

        await Promise.all(taskPromises)
    }

}
