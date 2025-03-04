import fs from "fs-extra"
import * as path from "path"
import { buildProject, installDependencies } from "@utils/project"
import { RootAnnotation } from "../team"

const rebuildProject = async (_state: typeof RootAnnotation.State): Promise<typeof RootAnnotation.State> => {
	const { projectId, sourceCode } = _state

		const projectPath = path.resolve(`projects/${projectId}`)

		try {

            let promises = []
			for (const [filePath, fileDetails] of Object.entries(sourceCode)) {
				const fullPath = path.join(projectPath, filePath)
				await fs.ensureFile(fullPath)
				const writingPromise = fs.writeFile(fullPath, fileDetails.code, "utf-8")
                promises.push(writingPromise)
			}

            await Promise.all(promises)
			await installDependencies(projectPath)
			await buildProject(projectPath)
		} catch (error) {
			console.error("Error writing files:", error)
			throw error
		}

	return {
		..._state
	}
}

export { rebuildProject }

