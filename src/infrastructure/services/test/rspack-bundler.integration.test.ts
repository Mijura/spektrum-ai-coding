import { describe, it, expect, beforeAll, afterAll } from "@rstest/core"
import { RspackBundlerService } from "@infra/services/bundler/rspack-bundler"
import { YarnPackageManager } from "@infra/services/bundler/yarn-package-manager"
import { DistFolderFilter } from "@infra/shared/filters/dist-folder-filter"
import { LocalFileSystem } from "@infra/services/filesystem/local-file-system"
import * as path from "path"
import * as os from "os"

describe("RspackBundlerService Integration Tests", () => {
	let service: RspackBundlerService
	let fileSystem: LocalFileSystem
	let testProjectPath: string

	beforeAll(async () => {
		fileSystem = new LocalFileSystem()
		testProjectPath = path.join(os.tmpdir(), `bundler-test-project-${Date.now()}`)

		// Create a minimal test project with package.json and build script
		await fileSystem.ensureDir(testProjectPath)
		const packageJson = {
			name: "bundler-test-project",
			version: "1.0.0",
			scripts: {
				build: "mkdir -p dist && echo '<html><body>Test</body></html>' > dist/index.html",
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

	it("should bundle a project", async () => {
		const yarnPackageManager = new YarnPackageManager()
		const distFolderFilter = new DistFolderFilter(fileSystem)
		service = new RspackBundlerService(yarnPackageManager, distFolderFilter)

		const buildArtifacts = await service.bundle(testProjectPath)

		expect(buildArtifacts).toBeDefined()
		expect(Object.keys(buildArtifacts).length).toBeGreaterThan(0)
		expect(buildArtifacts["index.html"]).toBeDefined()
	}, 30_000)
})
