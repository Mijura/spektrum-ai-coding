import { describe, it, expect, beforeAll } from "@rstest/core"
import { JigJoyVersionControl } from "@infra/services/version-control/jigjoy-vcs"
import { Version } from "@domain/version"

describe("JigJoyVersionControl Integration Tests", () => {
	let service: JigJoyVersionControl
	let testRepositoryId: string

	beforeAll(async () => {
		// Ensure the endpoint is configured
		if (!process.env.PROJECT_VERSIONING_ENDPOINT) {
			throw new Error("PROJECT_VERSIONING_ENDPOINT environment variable is not set")
		}
		service = new JigJoyVersionControl()
		testRepositoryId = await service.init()
		
		// Push initial version data to avoid 500 error when pulling from empty ProjectHistory
		const buildArtifacts = {
			"index.html": "<html><body>Test</body></html>",
			"app.js": "console.log('test');",
		}
		const sourceCodeArtifacts = {
			"src/index.ts": "export const test = 'test';",
		}
		
		const version: Version = {
			repositoryId: testRepositoryId,
			buildArtifacts: buildArtifacts,
			sourceCodeArtifacts: sourceCodeArtifacts,
		}
		
		await service.push(version)
	}, 5_000)

	it("should pull version from version control service", async () => {
		const version = await service.pull(testRepositoryId)

		expect(version).toBeDefined()
		expect(version.repositoryId).toBeDefined()
		expect(version.buildArtifacts).toBeDefined()
		expect(version.sourceCodeArtifacts).toBeDefined()
	}, 5_000)
})
