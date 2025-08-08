import { Task } from "@domain/entities/task"
import { Contributor } from "@domain/ports/ai/contributor"
import { Team } from "@domain/ports/ai/team"
import { ChangeRequest } from "@domain/value-objects/change-request"

export class FrontendTeam implements Team {

    contributors: Map<string, Contributor> = new Map()

	private entryPoint: Contributor
	constructor(
		designer: Contributor,
		developer: Contributor,
		scrumMaster: Contributor
	) {
		this.contributors.set(designer.name, designer)
		this.contributors.set(developer.name, developer)
		this.contributors.set(scrumMaster.name, scrumMaster)
		this.entryPoint = scrumMaster
	}

    addContributor(contributor: Contributor) {
		this.contributors.set(contributor.name, contributor)
    }

   getContributor(name: string): Contributor {
		const contributor = this.contributors.get(name)
		if (!contributor) {
			throw new Error(`Contributor "${name}" is not found.`)
		}
		return contributor
    }

	async startWorking(changeRequest: ChangeRequest) {
		if (!this.entryPoint) {
			throw new Error("Entry point is not set.")
		}
		return await this.entryPoint.execute(changeRequest)
	}
	
	
}