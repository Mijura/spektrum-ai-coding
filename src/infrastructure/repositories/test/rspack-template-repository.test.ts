import { describe, it, expect, beforeEach } from "@rstest/core"
import { RspackTemplateRepository } from "@infra/repositories/template/rspack-template-repository"
import { SourceCodeFilter } from "@infra/shared/filters/source-code-filter"
import { DistFolderFilter } from "@infra/shared/filters/dist-folder-filter"
import { LocalFileSystem } from "@infra/services/filesystem/local-file-system"
import { FileArtifacts } from "@domain/file-artifacts"

describe("Rspack Template Repository", () => {
	let repository: RspackTemplateRepository
	let sourceCodeFilter: SourceCodeFilter
	let distFolderFilter: DistFolderFilter

	beforeEach(() => {
		const fileSystem = new LocalFileSystem()
		sourceCodeFilter = new SourceCodeFilter(fileSystem)
		distFolderFilter = new DistFolderFilter(fileSystem)
		repository = new RspackTemplateRepository(sourceCodeFilter, distFolderFilter)
	})

	it("should fetch prebuilt files from template directory", async () => {
		const prebuiltFiles = await repository.fetchPrebuiltFiles()

		expect(prebuiltFiles).toBeDefined()
		expect(prebuiltFiles instanceof FileArtifacts).toBe(true)
		// Should have at least some files from the dist folder
		expect(Object.keys(prebuiltFiles).length).toBeGreaterThan(0)
	})

	it("should fetch source code from template directory", async () => {
		const sourceCode = await repository.fetchSourceCode()

		expect(sourceCode).toBeDefined()
		expect(sourceCode instanceof FileArtifacts).toBe(true)
		// Should have at least some source files
		expect(Object.keys(sourceCode).length).toBeGreaterThan(0)
	})

	it("should fetch prebuilt files with expected structure", async () => {
		const prebuiltFiles = await repository.fetchPrebuiltFiles()

		// Prebuilt files should come from the dist folder
		// Check that we have some common dist files
		const filePaths = Object.keys(prebuiltFiles)
		expect(filePaths.length).toBeGreaterThan(0)

		// All files should have content
		for (const [filePath, content] of Object.entries(prebuiltFiles)) {
			expect(filePath).toBeTruthy()
			expect(content).toBeTruthy()
			expect(typeof content).toBe("string")
		}
	})

	it("should fetch source code with expected structure", async () => {
		const sourceCode = await repository.fetchSourceCode()

		// Source code should come from the src folder (excluding dist, node_modules, etc.)
		const filePaths = Object.keys(sourceCode)
		expect(filePaths.length).toBeGreaterThan(0)

		// All files should have content
		for (const [filePath, content] of Object.entries(sourceCode)) {
			expect(filePath).toBeTruthy()
			expect(content).toBeTruthy()
			expect(typeof content).toBe("string")
		}

		// Should not include dist files
		const distFiles = filePaths.filter((path) => path.includes("dist"))
		expect(distFiles.length).toBe(0)

		// Should not include node_modules
		const nodeModulesFiles = filePaths.filter((path) => path.includes("node_modules"))
		expect(nodeModulesFiles.length).toBe(0)
	})

	it("should fetch prebuilt files that are different from source code", async () => {
		const prebuiltFiles = await repository.fetchPrebuiltFiles()
		const sourceCode = await repository.fetchSourceCode()

		// Prebuilt files and source code should have different file paths
		const prebuiltPaths = Object.keys(prebuiltFiles)
		const sourcePaths = Object.keys(sourceCode)

		// They should not share the same files (prebuilt is from dist, source is from src)
		const commonPaths = prebuiltPaths.filter((path) => sourcePaths.includes(path))
		expect(commonPaths.length).toBe(0)
	})

	it("should fetch source code including TypeScript and configuration files", async () => {
		const sourceCode = await repository.fetchSourceCode()
		const filePaths = Object.keys(sourceCode)

		// Should include TypeScript files
		const tsFiles = filePaths.filter((path) => path.endsWith(".ts") || path.endsWith(".tsx"))
		expect(tsFiles.length).toBeGreaterThan(0)

		// Should include configuration files (package.json, tsconfig.json, etc.)
		const configFiles = filePaths.filter(
			(path) =>
				path.includes("package.json") ||
				path.includes("tsconfig.json") ||
				path.includes("tailwind.config.js") ||
				path.includes("postcss.config.js"),
		)
		expect(configFiles.length).toBeGreaterThan(0)
	})

	it("should fetch prebuilt files including HTML and bundled assets", async () => {
		const prebuiltFiles = await repository.fetchPrebuiltFiles()
		const filePaths = Object.keys(prebuiltFiles)

		// Should include HTML files
		const htmlFiles = filePaths.filter((path) => path.endsWith(".html"))
		expect(htmlFiles.length).toBeGreaterThan(0)

		// Should include CSS files (bundled)
		const cssFiles = filePaths.filter((path) => path.endsWith(".css"))
		expect(cssFiles.length).toBeGreaterThan(0)

		// Should include JS files (bundled)
		const jsFiles = filePaths.filter((path) => path.endsWith(".js"))
		expect(jsFiles.length).toBeGreaterThan(0)
	})

	it("should return consistent results on multiple calls", async () => {
		const prebuiltFiles1 = await repository.fetchPrebuiltFiles()
		const prebuiltFiles2 = await repository.fetchPrebuiltFiles()
		const sourceCode1 = await repository.fetchSourceCode()
		const sourceCode2 = await repository.fetchSourceCode()

		// Results should be consistent
		expect(Object.keys(prebuiltFiles1).length).toBe(Object.keys(prebuiltFiles2).length)
		expect(Object.keys(sourceCode1).length).toBe(Object.keys(sourceCode2).length)

		// File paths should match
		expect(Object.keys(prebuiltFiles1).sort()).toEqual(Object.keys(prebuiltFiles2).sort())
		expect(Object.keys(sourceCode1).sort()).toEqual(Object.keys(sourceCode2).sort())
	})
})
