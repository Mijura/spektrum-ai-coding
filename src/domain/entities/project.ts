import { v4 as uuidv4 } from "uuid"

export enum ProjectStatus {
	ACTIVE = "Active",
	ARCHIVED = "Archived"
}
export interface Deployment {
	url: string
	version: any
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
	public repositoryId: string
	public devEnvironmentId: string
	public prodEnvironmentId: string 
	public latestDevDeployment: Deployment | null
	public latestProdDeployment: Deployment | null

	private constructor(
		id: string,
		ownerId: string,
		name: string,
		description: string,
		created: string,
		updated: string | null,
		status: ProjectStatus,
		detailsUpdated: boolean,
		repositoryId: string,
		devEnvironmentId: string,
		prodEnvironmentId: string,
		latestDevDeployment: Deployment | null,
		latestProdDeployment: Deployment | null
	) {
		this.id = id
		this.ownerId = ownerId
		this.name = name
		this.description = description
		this.created = created
		this.updated = updated
		this.status = status
		this.detailsUpdated = detailsUpdated
		this.repositoryId = repositoryId
		this.devEnvironmentId = devEnvironmentId
		this.prodEnvironmentId = prodEnvironmentId
		this.latestDevDeployment = latestDevDeployment
		this.latestProdDeployment = latestProdDeployment
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

	setLatestDevDeployment(deployment: Deployment) {
		
		const url = deployment.url
		const version = deployment.version
		if(url === "") {
			throw new Error("URL cannot be empty")
		}
		if(!version) {
			throw new Error("Version cannot be empty")
		}

		if(this.latestDevDeployment && this.latestDevDeployment.url !== url) {
			throw new Error("URL cannot be changed after it has been set")
		}

		this.latestDevDeployment = deployment
		this.updated = new Date().toISOString()
	}

	setLatestProdDeployment(deployment: Deployment) {

		const url = deployment.url
		const version = deployment.version
		if(url === "") {
			throw new Error("URL cannot be empty")
		}
		if(!version) {
			throw new Error("Version cannot be empty")
		}

		if(this.latestProdDeployment && this.latestProdDeployment.url !== url) {
			throw new Error("URL cannot be changed after it has been set")
		}

		this.latestProdDeployment = deployment
		this.updated = new Date().toISOString()
	}
	

	// Factory method to create a new project
	static create(name: string, description: string, owner: string, repositoryId: string): Project {

		if(owner === "") {
			throw new Error("Owner cannot be empty")
		}

		const id = uuidv4() // Generate unique ID
		const devEnvironmentId = uuidv4()
		const prodEnvironmentId = uuidv4()
		const created = new Date().toISOString() // ISO format
		return new Project(id, owner, name, description, created, null, ProjectStatus.ACTIVE, false, repositoryId, devEnvironmentId, prodEnvironmentId, null, null)
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
		repositoryId: string
		devEnvironmentId: string
		prodEnvironmentId: string
		latestDevDeployment: Deployment | null
		latestProdDeployment: Deployment | null
	}): Project {
		return new Project(data.id, data.ownerId, data.name, data.description, data.created, data.updated, data.status, data.detailsUpdated, data.repositoryId, data.devEnvironmentId, data.prodEnvironmentId, data.latestDevDeployment, data.latestProdDeployment)
	}
}
