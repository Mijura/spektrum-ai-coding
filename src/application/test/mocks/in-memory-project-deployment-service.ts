import { ProjectDeploymentService } from "@app/ports/services/project-deployment-service"
import { DeploymentRequest } from "@app/types/deployment-request"
import { EntryPoint } from "@app/types/entry-point"

export class InMemoryProjectDeploymentService implements ProjectDeploymentService {
	private byProjectId: Map<string, EntryPoint> = new Map()

	private defaultEntryPoint: EntryPoint = {
		moduleId: "default-module-id",
		assetBaseUrl: "https://default-assets.example.com",
		publicAppUrl: "https://default-app.example.com",
	}

	/**
	 * Provide deterministic output for a specific projectId.
	 */
	seed(projectId: string, entryPoint: EntryPoint) {
		this.byProjectId.set(projectId, entryPoint)
	}

	/**
	 * Provide fallback output when no project-specific value is seeded.
	 */
	setDefault(entryPoint: EntryPoint) {
		this.defaultEntryPoint = entryPoint
	}

	async deployModule(projectId: string, deploymentRequest: DeploymentRequest): Promise<EntryPoint> {
		return this.byProjectId.get(projectId) ?? this.defaultEntryPoint
	}
}
