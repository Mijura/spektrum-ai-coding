import { v4 as uuidv4 } from "uuid"

export enum ProjectStatus {
	ACTIVE = "Active",
	ARCHIVED = "Archived"
}

export class Project {

	public readonly id: string
	public readonly created: string // ISO String
	public updated: string | null // ISO String
	public ownerId: string
	public name: string
	public description: string
	public status: ProjectStatus
	private _deploymentId: string | null

	private constructor(
		id: string,
		ownerId: string,
		name: string,
		description: string,
		created: string,
		updated: string | null,
		deploymentId: string | null,
		status: ProjectStatus
	) {
		this.id = id
		this.ownerId = ownerId
		this.name = name
		this.description = description
		this.created = created
		this.updated = updated
		this._deploymentId = deploymentId
		this.status = status
	}

	// Factory method to create a new project
	static create(name: string, description: string, owner: string): Project {
		const id = uuidv4() // Generate unique ID
		const created = new Date().toISOString() // ISO format
		return new Project(id, owner, name, description, created, null, null, ProjectStatus.ACTIVE)
	}

	/** Restore method to rehydrate a project from persisted data */
	static restore(data: {
		id: string
		ownerId: string
		name: string
		description: string
		created: string
		updated: string | null
		deploymentId: string | null
		status: ProjectStatus
	}): Project {
		return new Project(data.id, data.ownerId, data.name, data.description, data.created, data.updated, data.deploymentId, data.status)
	}

	public get deploymentId(): string | null {
		return this._deploymentId
	}

	archive() {
		this.status = ProjectStatus.ARCHIVED
    }

	assignDeploymentId(): boolean {
		if (this._deploymentId === null) {
			this._deploymentId = uuidv4()
			this.updated = new Date().toISOString()
			return true
		}

		return false
	}
}
