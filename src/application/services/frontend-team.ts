import { Contributor } from "@domain/ports/ai/contributor"
import { Team } from "@domain/ports/ai/team"
import { WorkUnit } from "@domain/value-objects/work-unit"

export class FrontendTeam implements Team {

    contributors: Map<string, Contributor> = new Map()

	private entryPoint: Contributor
	constructor(
		developer: Contributor
	) {
		this.contributors.set(developer.name, developer)
		this.entryPoint = developer
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

	async implement(changeRequest: WorkUnit) {
		if (!this.entryPoint) {
			throw new Error("Entry point is not set.")
		}
		return await this.entryPoint.execute(changeRequest)
	}
	
	
}