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
	public detailsUpdated: boolean

	private constructor(
		id: string,
		ownerId: string,
		name: string,
		description: string,
		created: string,
		updated: string | null,
		status: ProjectStatus,
		detailsUpdated: boolean
	) {
		this.id = id
		this.ownerId = ownerId
		this.name = name
		this.description = description
		this.created = created
		this.updated = updated
		this.status = status
		this.detailsUpdated = detailsUpdated
	}

	setName(name: string) {
		if (this.name === name) {
			return
		}
		if (name === "") {
			throw new Error("Name cannot be empty")
		}
		this.name = name
		this.updated = new Date().toISOString()
	}

	setDescription(description: string) {	
		if (this.description === description) {
			return
		}
		this.description = description
		this.updated = new Date().toISOString()
	}

	setDetails(name: string, description: string) {
		this.name = name
		this.description = description
		this.detailsUpdated = true
		this.updated = new Date().toISOString()
	}
	
	// Factory method to create a new project
	static create(name: string, description: string, owner: string): Project {

		if(owner === "") {
			throw new Error("Owner cannot be empty")
		}

		const id = uuidv4() // Generate unique ID
		const created = new Date().toISOString() // ISO format
		return new Project(id, owner, name, description, created, null, ProjectStatus.ACTIVE, false)
	}

	archive() {
		this.status = ProjectStatus.ARCHIVED
    }

		/** Restore method to rehydrate a project from persisted data */
	static rehydrate(data: {
		id: string
		ownerId: string
		name: string
		description: string
		created: string
		updated: string | null
		status: ProjectStatus
		detailsUpdated: boolean
	}): Project {
		return new Project(data.id, data.ownerId, data.name, data.description, data.created, data.updated, data.status, data.detailsUpdated)
	}
}
