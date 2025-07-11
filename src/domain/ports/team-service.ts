import { Task } from "@domain/entities/task"
import { Contributor } from "./contirbutor"

export interface TeamService {

    contributors: Map<string, Contributor>

    addContributor(contributor: Contributor): void
    startWorking(task: Task): Promise<any>
}