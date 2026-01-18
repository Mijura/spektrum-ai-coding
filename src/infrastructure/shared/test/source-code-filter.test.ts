import { describe, it, expect, beforeEach } from "@rstest/core"
import { SourceCodeFilter } from "@infra/shared/filters/source-code-filter"
import { InMemoryFileSystemPort } from "@app/test/mocks/in-memory-file-system"
import path from "path"

describe("SourceCodeFilter", () => {
	let filter: SourceCodeFilter
	let fileSystem: InMemoryFileSystemPort

	beforeEach(() => {
		fileSystem = new InMemoryFileSystemPort()
		filter = new SourceCodeFilter(fileSystem)
	})

	it("should fetch source code files from a directory", async () => {
		const basePath = "/project"
		fileSystem.seedDirectory(basePath)
		fileSystem.seedFile(path.join(basePath, "src", "index.ts"), "export const x = 1")
		fileSystem.seedFile(path.join(basePath, "src", "App.tsx"), "export default function App() {}")
		fileSystem.seedDirectory(path.join(basePath, "src"))

		const result = await filter.fetch(basePath)

		expect(result).toBeDefined()
		expect(result["src/index.ts"]).toBe("export const x = 1")
		expect(result["src/App.tsx"]).toBe("export default function App() {}")
	})

	it("should exclude blacklisted files and directories", async () => {
		const basePath = "/project"
		fileSystem.seedDirectory(basePath)
		fileSystem.seedFile(path.join(basePath, "src", "index.ts"), "export const x = 1")
		fileSystem.seedFile(path.join(basePath, "package.json"), '{"name": "test"}')
		fileSystem.seedFile(path.join(basePath, "package-lock.json"), "{}")
		fileSystem.seedFile(path.join(basePath, "yarn.lock"), "# yarn lock")
		fileSystem.seedFile(path.join(basePath, ".env.example"), "KEY=value")
		fileSystem.seedDirectory(path.join(basePath, "node_modules"))
		fileSystem.seedDirectory(path.join(basePath, "dist"))
		fileSystem.seedDirectory(path.join(basePath, "src"))

		const result = await filter.fetch(basePath)

		expect(result["src/index.ts"]).toBe("export const x = 1")
		expect(result["package.json"]).toBe('{"name": "test"}')
		expect(result["package-lock.json"]).toBeUndefined()
		expect(result["yarn.lock"]).toBeUndefined()
		expect(result[".env.example"]).toBeUndefined()
		expect(result["node_modules"]).toBeUndefined()
		expect(result["dist"]).toBeUndefined()
	})

	it("should handle nested directories", async () => {
		const basePath = "/project"
		fileSystem.seedDirectory(basePath)
		fileSystem.seedDirectory(path.join(basePath, "src"))
		fileSystem.seedDirectory(path.join(basePath, "src", "components"))
		fileSystem.seedFile(path.join(basePath, "src", "index.ts"), "export const x = 1")
		fileSystem.seedFile(path.join(basePath, "src", "components", "Button.tsx"), "export const Button = () => null")
		fileSystem.seedFile(path.join(basePath, "package.json"), '{"name": "test"}')

		const result = await filter.fetch(basePath)

		expect(result["src/index.ts"]).toBe("export const x = 1")
		expect(result["src/components/Button.tsx"]).toBe("export const Button = () => null")
		expect(result["package.json"]).toBe('{"name": "test"}')
	})

	it("should exclude blacklisted directories even if they contain files", async () => {
		const basePath = "/project"
		fileSystem.seedDirectory(basePath)
		fileSystem.seedDirectory(path.join(basePath, "node_modules"))
		fileSystem.seedDirectory(path.join(basePath, "dist"))
		fileSystem.seedFile(path.join(basePath, "src", "index.ts"), "export const x = 1")
		fileSystem.seedFile(path.join(basePath, "node_modules", "some-package", "index.js"), "module.exports = {}")
		fileSystem.seedFile(path.join(basePath, "dist", "bundle.js"), "compiled code")
		fileSystem.seedDirectory(path.join(basePath, "src"))
		fileSystem.seedDirectory(path.join(basePath, "node_modules", "some-package"))

		const result = await filter.fetch(basePath)

		expect(result["src/index.ts"]).toBe("export const x = 1")
		expect(result["node_modules/some-package/index.js"]).toBeUndefined()
		expect(result["dist/bundle.js"]).toBeUndefined()
	})

	it("should return empty object for empty directory", async () => {
		const basePath = "/project"
		fileSystem.seedDirectory(basePath)

		const result = await filter.fetch(basePath)

		expect(result).toBeDefined()
		expect(Object.keys(result).length).toBe(0)
	})

	it("should include configuration files that are not blacklisted", async () => {
		const basePath = "/project"
		fileSystem.seedDirectory(basePath)
		fileSystem.seedFile(path.join(basePath, "package.json"), '{"name": "test"}')
		fileSystem.seedFile(path.join(basePath, "tsconfig.json"), '{"compilerOptions": {}}')
		fileSystem.seedFile(path.join(basePath, ".gitignore"), "node_modules")

		const result = await filter.fetch(basePath)

		expect(result["package.json"]).toBe('{"name": "test"}')
		expect(result["tsconfig.json"]).toBe('{"compilerOptions": {}}')
		expect(result[".gitignore"]).toBe("node_modules")
	})
})
