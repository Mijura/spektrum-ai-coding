import { Task } from "@domain/entities/task"
import { Contributor } from "./contributor"

export interface Team {

    contributors: Map<string, Contributor>

    addContributor(contributor: Contributor): void
    startWorking(task: Task): Promise<any>
}