import { getProject } from "@adapters/secodnary/project-database-adapter"
import { RootAnnotation } from "../team"
import { fetchFiles } from "@utils/project"

const fetchProject = async (_state: typeof RootAnnotation.State): Promise<typeof RootAnnotation.State> => {
	const { projectId } = _state

	const project = await getProject(projectId)
	const sourceCode = await fetchFiles(projectId)

	console.log(project)

	return {
		..._state,
		projectDetails: project,
		sourceCode: sourceCode,
	}
}

export { fetchProject }
