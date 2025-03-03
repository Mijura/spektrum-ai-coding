import { RootAnnotation } from "../team"
import { saveProject } from "@adapters/secodnary/project-database-adapter"

const updateProjectDetails = async (_state: typeof RootAnnotation.State): Promise<typeof RootAnnotation.State> => {
	const { projectDetails } = _state
		await saveProject(projectDetails)

        console.log("Project details updated successfully")
	return {
		..._state
	}
}

export { updateProjectDetails }

