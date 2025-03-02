import { RootAnnotation } from "../team"
import { fetchFiles } from "@utils/project"

const fetchSourceCode = async (_state: typeof RootAnnotation.State): Promise<typeof RootAnnotation.State> => {
	const { projectId } = _state

	const sourceCode = await fetchFiles(projectId)

	return {
		..._state,
		sourceCode: sourceCode,
	}
}

export { fetchSourceCode }
