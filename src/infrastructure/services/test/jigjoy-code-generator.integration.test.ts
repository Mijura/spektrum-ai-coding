import { describe, it, expect, beforeAll } from "@rstest/core"
import { JigJoyCodeGenerator } from "@infra/services/code-generator/jigjoy-code-generator"
import { Task, TaskStatus } from "@jigjoy-io/task-contracts"
import { FileArtifacts } from "@domain/file-artifacts"

describe("JigJoyCodeGenerator Integration Tests", () => {
	let service: JigJoyCodeGenerator

	beforeAll(() => {
		// The mosaic Agent should handle its own endpoint configuration
		// If needed, check for MOSAIC_ENDPOINT or similar environment variable
		service = new JigJoyCodeGenerator()
	})

	it("should generate code from a task and source code", async () => {
		const task: Task = {
			id: `test-task-${Date.now()}`,
			projectId: `test-project-${Date.now()}`,
			title: "Add a simple counter component",
			description: "Create a counter component that displays a number and has increment and decrement buttons",
			status: TaskStatus.TODO,
			created: new Date().toISOString(),
			updated: new Date().toISOString(),
			activities: [],
		}

		const sourceCode: FileArtifacts = {
			"src/index.tsx": `import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">My App</h1>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)`,
			"src/index.css": `@tailwind base;
@tailwind components;
@tailwind utilities;`,
			"package.json": `{
  "name": "test-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}`,
		}

		const result = await service.generateCode(task, sourceCode)

		expect(result).toBeDefined()
		expect(result.comment).toBeDefined()
		expect(typeof result.comment).toBe("string")
		expect(result.comment.length).toBeGreaterThan(0)
		expect(result.sourceCode).toBeDefined()
		expect(typeof result.sourceCode).toBe("object")
		expect(Object.keys(result.sourceCode).length).toBeGreaterThan(0)
		
		// Verify that original source code is preserved
		expect(result.sourceCode["src/index.tsx"]).toBeDefined()
		expect(result.sourceCode["src/index.css"]).toBeDefined()
		expect(result.sourceCode["package.json"]).toBeDefined()
	}, 600_000) // 10 minutes timeout
})
