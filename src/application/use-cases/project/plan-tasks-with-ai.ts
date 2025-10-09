import { PlanTasksWithAI } from "@domain/use-cases/project/plan-tasks-with-ai"
import { Task } from "@domain/entities/task"
import { MarketingService } from "@domain/ports/services/marketing-service"    
import { Agent } from "@domain/agent"    
import { TaskRepository } from "@domain/ports/repositories/task-repository"

export class PlanTasksWithAIUseCase implements PlanTasksWithAI {
	constructor(
        private readonly productOwner: Agent,
        private readonly marketingService: MarketingService,
        private readonly taskRepository: TaskRepository
	) {}
    
    async execute(projectId: string, projectDescription: string): Promise<Task[]> {

        console.log("Planning tasks with AI")
        const task = Task.create("Product Owner", projectId, "Plan Tasks", projectDescription)
        await this.marketingService.updateProjectDetails(task)

        const tasks = await this.productOwner.execute(task)

        // Save all tasks
        const taskPromises = []
        for (const t of tasks) {
            const taskPromise = this.taskRepository.save(t)
            taskPromises.push(taskPromise)
        }

        await Promise.all(taskPromises)

        return tasks
    }
    
}