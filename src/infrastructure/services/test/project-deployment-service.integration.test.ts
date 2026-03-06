import { describe, it, expect, beforeAll } from "@rstest/core"
import { JigJoyProjectDeploymentService } from "@infra/services/project-deployment/project-deployment-service"

describe("JigJoyProjectDeploymentService Integration Tests", () => {
	let service: JigJoyProjectDeploymentService
	const testProjectId = `test-project-${Date.now()}`

	beforeAll(() => {
		service = new JigJoyProjectDeploymentService()
	})

	it("should create a cloud profile for a project", async () => {
		const projectId = `${testProjectId}-cloud-profile`

		await expect(service.createCloudProfile(projectId)).resolves.not.toThrow()
	}, 5_000)

	// Note: deployModule test is not included here because it requires a module
	// to be initialized first via the AI coding service. The full integration flow
	// (initialize module -> deploy module) is tested in the use case tests.
	// Once error handling is improved in deployModule, we can add a test here
	// that expects an appropriate error when deploying a non-existent module.
})
