import { Contribution } from "@app/types/contribution"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"
import { Task } from "@jigjoy-ai/task-contracts"

export interface ProjectPlanningService {
	recordWork(contribution: Contribution, auth: Auth<UserData>): Promise<Task>
    leaveComment(taskId: string, comment: string, authorName: string, auth: Auth<UserData>): Promise<Task>
}