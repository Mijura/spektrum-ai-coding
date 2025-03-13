import { v4 as uuidv4 } from "uuid"

export class Project {
	public readonly id: string
	public readonly created: string // ISO String
	public updated: string | null // ISO String
	public owner: string | null
	public name: string
	public description: string
	private _deploymentId: string | null

	private constructor(
		id: string,
		owner: string | null,
		name: string,
		description: string,
		created: string,
		updated: string | null,
		deploymentId: string | null
	) {
		this.id = id
		this.owner = owner
		this.name = name
		this.description = description
		this.created = created
		this.updated = updated
		this._deploymentId = deploymentId
	}

	// Factory method to create a new project
	static create(name: string, description: string, owner?: string): Project {
		const id = uuidv4() // Generate unique ID
		const created = new Date().toISOString() // ISO format
		const user = owner ? owner : "GUEST"
		return new Project(id, user, name, description, created, null, null)
	}

	/** Restore method to rehydrate a project from persisted data */
	static restore(data: {
		id: string
		owner: string | null
		name: string
		description: string
		created: string
		updated: string | null
		deploymentId: string | null
	}): Project {
		return new Project(data.id, data.owner, data.name, data.description, data.created, data.updated, data.deploymentId)
	}

	public get deploymentId(): string | null {
		return this._deploymentId
	}

	assignDeploymentId(): boolean {
		if (this._deploymentId === null) {
			this._deploymentId = uuidv4()
			this.updated = new Date().toISOString()
			return true
		}

		return false
	}

	updateOwner(owner: string) {
		if (this.owner === "GUEST") {
			this.owner = owner
			this.updated = new Date().toISOString()
		}
	}
}
