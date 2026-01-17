import { describe, it, expect } from "@rstest/core"
import { FileArtifacts } from "@domain/file-artifacts"

describe("FileArtifacts", () => {
	it("should create an empty FileArtifacts instance", () => {
		// Act
		const fileArtifacts = new FileArtifacts()

		// Assert
		expect(fileArtifacts).toBeInstanceOf(FileArtifacts)
	})

	it("should allow setting file paths as properties", () => {
		// Arrange
		const fileArtifacts = new FileArtifacts()

		// Act
		fileArtifacts["path/to/file1.ts"] = "content1"
		fileArtifacts["path/to/file2.ts"] = "content2"

		// Assert
		expect(fileArtifacts["path/to/file1.ts"]).toBe("content1")
		expect(fileArtifacts["path/to/file2.ts"]).toBe("content2")
	})

	it("should allow accessing file paths as properties", () => {
		// Arrange
		const fileArtifacts = new FileArtifacts()
		fileArtifacts["src/index.ts"] = "export const x = 1"

		// Act
		const content = fileArtifacts["src/index.ts"]

		// Assert
		expect(content).toBe("export const x = 1")
	})

	it("should allow overwriting file content", () => {
		// Arrange
		const fileArtifacts = new FileArtifacts()
		fileArtifacts["src/index.ts"] = "original content"

		// Act
		fileArtifacts["src/index.ts"] = "updated content"

		// Assert
		expect(fileArtifacts["src/index.ts"]).toBe("updated content")
	})

	it("should allow storing multiple files with different paths", () => {
		// Arrange
		const fileArtifacts = new FileArtifacts()

		// Act
		fileArtifacts["src/file1.ts"] = "content1"
		fileArtifacts["src/file2.ts"] = "content2"
		fileArtifacts["dist/file1.js"] = "compiled1"
		fileArtifacts["dist/file2.js"] = "compiled2"

		// Assert
		expect(fileArtifacts["src/file1.ts"]).toBe("content1")
		expect(fileArtifacts["src/file2.ts"]).toBe("content2")
		expect(fileArtifacts["dist/file1.js"]).toBe("compiled1")
		expect(fileArtifacts["dist/file2.js"]).toBe("compiled2")
	})

	it("should allow storing empty string content", () => {
		// Arrange
		const fileArtifacts = new FileArtifacts()

		// Act
		fileArtifacts["empty-file.ts"] = ""

		// Assert
		expect(fileArtifacts["empty-file.ts"]).toBe("")
	})

	it("should allow storing files with complex paths", () => {
		// Arrange
		const fileArtifacts = new FileArtifacts()

		// Act
		fileArtifacts["src/components/button/Button.tsx"] = "export const Button = () => null"
		fileArtifacts["src/utils/helpers/index.ts"] = "export const helper = () => {}"

		// Assert
		expect(fileArtifacts["src/components/button/Button.tsx"]).toBe("export const Button = () => null")
		expect(fileArtifacts["src/utils/helpers/index.ts"]).toBe("export const helper = () => {}")
	})
})
