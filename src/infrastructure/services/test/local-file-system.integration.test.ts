import { describe, it, expect, beforeAll, afterAll } from "@rstest/core"
import { LocalFileSystem } from "@infra/services/filesystem/local-file-system"
import * as path from "path"
import * as os from "os"

describe("LocalFileSystem Integration Tests", () => {
	let service: LocalFileSystem
	let testDir: string
	let testFilePath: string
	let testDirPath: string

	beforeAll(() => {
		service = new LocalFileSystem()
		testDir = path.join(os.tmpdir(), `file-system-test-${Date.now()}`)
		testFilePath = path.join(testDir, "test-file.txt")
		testDirPath = path.join(testDir, "test-dir")
	})

	afterAll(async () => {
		// Clean up test directory
		if (await service.exists(testDir)) {
			await service.removeDir(testDir)
		}
	}, 5_000)

	it("should write and read a file", async () => {
		const content = "Test file content"

		await service.ensureDir(testDir)
		await service.writeFile(testFilePath, content)

		const readContent = await service.readFile(testFilePath)

		expect(readContent).toBe(content)
	}, 5_000)

	it("should copy a folder", async () => {
		const sourceDir = path.join(testDir, "source")
		const destDir = path.join(testDir, "destination")
		const sourceFile = path.join(sourceDir, "file.txt")

		await service.ensureDir(sourceDir)
		await service.writeFile(sourceFile, "Source file content")
		await service.copyFolder(sourceDir, destDir)

		const copiedFile = path.join(destDir, "file.txt")
		const exists = await service.exists(copiedFile)
		const content = await service.readFile(copiedFile)

		expect(exists).toBe(true)
		expect(content).toBe("Source file content")
	}, 5_000)

	it("should check if directory exists and read directory contents", async () => {
		await service.ensureDir(testDirPath)

		const exists = await service.exists(testDirPath)
		const isDir = await service.isDirectory(testDirPath)

		expect(exists).toBe(true)
		expect(isDir).toBe(true)
	}, 5_000)
})
