import { Contribution } from "@app/types/contribution"
import { Task } from "@jigjoy-io/task-contracts"

export interface ProjectPlanningService {
	recordWork(contribution: Contribution): Promise<Task>
    leaveComment(taskId: string, comment: string, authorId: string): Promise<Task>
}