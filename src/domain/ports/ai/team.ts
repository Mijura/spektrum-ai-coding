import { Contributor } from "./contributor"
import { WorkUnit } from "@domain/value-objects/work-unit"

export interface Team {

    contributors: Map<string, Contributor>

    addContributor(contributor: Contributor): void
    getContributor(name: string): Contributor
    startWorking(changeRequest: WorkUnit): Promise<any>
}