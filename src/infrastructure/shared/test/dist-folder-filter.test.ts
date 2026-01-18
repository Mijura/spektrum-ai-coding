import { describe, it, expect, beforeEach } from "@rstest/core"
import { DistFolderFilter } from "@infra/shared/filters/dist-folder-filter"
import { InMemoryFileSystemPort } from "@app/test/mocks/in-memory-file-system"
import path from "path"

describe("DistFolderFilter", () => {
	let filter: DistFolderFilter
	let fileSystem: InMemoryFileSystemPort

	beforeEach(() => {
		fileSystem = new InMemoryFileSystemPort()
		filter = new DistFolderFilter(fileSystem)
	})

	it("should fetch files from dist directory", async () => {
		const basePath = "/project"
		const distPath = path.join(basePath, "dist")
		fileSystem.seedDirectory(basePath)
		fileSystem.seedDirectory(distPath)
		fileSystem.seedFile(path.join(distPath, "index.html"), "<html></html>")
		fileSystem.seedFile(path.join(distPath, "bundle.js"), "compiled code")

		const result = await filter.fetch(basePath)

		expect(result).toBeDefined()
		expect(result["index.html"]).toBe("<html></html>")
		expect(result["bundle.js"]).toBe("compiled code")
	})

	it("should return empty object when dist directory does not exist", async () => {
		const basePath = "/project"
		fileSystem.seedDirectory(basePath)
		fileSystem.seedFile(path.join(basePath, "src", "index.ts"), "export const x = 1")
		fileSystem.seedDirectory(path.join(basePath, "src"))

		const result = await filter.fetch(basePath)

		expect(result).toBeDefined()
		expect(Object.keys(result).length).toBe(0)
	})

	it("should handle nested directories in dist folder", async () => {
		const basePath = "/project"
		const distPath = path.join(basePath, "dist")
		fileSystem.seedDirectory(basePath)
		fileSystem.seedDirectory(distPath)
		fileSystem.seedDirectory(path.join(distPath, "assets"))
		fileSystem.seedFile(path.join(distPath, "index.html"), "<html></html>")
		fileSystem.seedFile(path.join(distPath, "assets", "style.css"), "body { margin: 0; }")
		fileSystem.seedFile(path.join(distPath, "assets", "script.js"), "console.log('hello')")

		const result = await filter.fetch(basePath)

		expect(result["index.html"]).toBe("<html></html>")
		expect(result["assets/style.css"]).toBe("body { margin: 0; }")
		expect(result["assets/script.js"]).toBe("console.log('hello')")
	})

	it("should not include files outside dist directory", async () => {
		const basePath = "/project"
		const distPath = path.join(basePath, "dist")
		fileSystem.seedDirectory(basePath)
		fileSystem.seedDirectory(distPath)
		fileSystem.seedDirectory(path.join(basePath, "src"))
		fileSystem.seedFile(path.join(distPath, "index.html"), "<html></html>")
		fileSystem.seedFile(path.join(basePath, "src", "index.ts"), "export const x = 1")
		fileSystem.seedFile(path.join(basePath, "package.json"), '{"name": "test"}')

		const result = await filter.fetch(basePath)

		expect(result["index.html"]).toBe("<html></html>")
		expect(result["src/index.ts"]).toBeUndefined()
		expect(result["package.json"]).toBeUndefined()
	})

	it("should return empty object for empty dist directory", async () => {
		const basePath = "/project"
		const distPath = path.join(basePath, "dist")
		fileSystem.seedDirectory(basePath)
		fileSystem.seedDirectory(distPath)

		const result = await filter.fetch(basePath)

		expect(result).toBeDefined()
		expect(Object.keys(result).length).toBe(0)
	})

	it("should handle multiple levels of nesting in dist", async () => {
		const basePath = "/project"
		const distPath = path.join(basePath, "dist")
		fileSystem.seedDirectory(basePath)
		fileSystem.seedDirectory(distPath)
		fileSystem.seedDirectory(path.join(distPath, "js"))
		fileSystem.seedDirectory(path.join(distPath, "js", "chunks"))
		fileSystem.seedFile(path.join(distPath, "index.html"), "<html></html>")
		fileSystem.seedFile(path.join(distPath, "js", "main.js"), "main code")
		fileSystem.seedFile(path.join(distPath, "js", "chunks", "vendor.js"), "vendor code")

		const result = await filter.fetch(basePath)

		expect(result["index.html"]).toBe("<html></html>")
		expect(result["js/main.js"]).toBe("main code")
		expect(result["js/chunks/vendor.js"]).toBe("vendor code")
	})
})
