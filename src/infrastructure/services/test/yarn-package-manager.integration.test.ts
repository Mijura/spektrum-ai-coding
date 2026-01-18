import { describe, it, expect, beforeAll, afterAll } from "@rstest/core"
import { YarnPackageManager } from "@infra/services/bundler/yarn-package-manager"
import { LocalFileSystem } from "@infra/services/filesystem/local-file-system"
import * as path from "path"
import * as os from "os"

describe("YarnPackageManager Integration Tests", () => {
	let service: YarnPackageManager
	let fileSystem: LocalFileSystem
	let testProjectPath: string

	beforeAll(async () => {
		service = new YarnPackageManager()
		fileSystem = new LocalFileSystem()
		testProjectPath = path.join(os.tmpdir(), `yarn-test-project-${Date.now()}`)

		// Create a minimal test project with package.json
		await fileSystem.ensureDir(testProjectPath)
		const packageJson = {
			name: "test-project",
			version: "1.0.0",
			scripts: {
				build: "mkdir -p dist && echo 'Build complete' > dist/output.txt",
			},
		}
		await fileSystem.writeFile(
			path.join(testProjectPath, "package.json"),
			JSON.stringify(packageJson, null, 2),
		)
	}, 5_000)

	afterAll(async () => {
		// Clean up test project directory
		if (await fileSystem.exists(testProjectPath)) {
			await fileSystem.removeDir(testProjectPath)
		}
	}, 10_000)

	it("should install dependencies", async () => {
		// Note: This test will install yarn dependencies if package.json has them
		// For a minimal test, we just verify the command runs without error
		const result = await service.install(testProjectPath)

		expect(result).toBe(true)
	}, 30_000)

	it("should build the project", async () => {
		const result = await service.build(testProjectPath)

		expect(result).toBe(true)

		// Verify build output exists
		const distPath = path.join(testProjectPath, "dist")
		const distExists = await fileSystem.exists(distPath)
		expect(distExists).toBe(true)
	}, 10_000)
})
