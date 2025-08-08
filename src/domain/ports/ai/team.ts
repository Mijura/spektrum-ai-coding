import { Contributor } from "./contributor"
import { ChangeRequest } from "@domain/value-objects/change-request"

export interface Team {

    contributors: Map<string, Contributor>

    addContributor(contributor: Contributor): void
    getContributor(name: string): Contributor
    startWorking(changeRequest: ChangeRequest): Promise<any>
}