import { Contribution } from "@app/types/contribution"
import { Task } from "@jigjoy-ai/task-contracts"

export interface ProjectPlanningService {
	recordWork(contribution: Contribution): Promise<Task>
    leaveComment(taskId: string, comment: string, authorId: string): Promise<Task>
}