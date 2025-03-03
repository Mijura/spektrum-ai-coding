import { SourceCodeDto } from "@dto/source-code";
import { RootAnnotation } from "../team"
import { saveProject } from "@adapters/secodnary/project-database-adapter"

const updateProjectDetails = async (_state: typeof RootAnnotation.State): Promise<typeof RootAnnotation.State> => {
	const { projectDetails, sourceCode } = _state

        projectDetails.files = Object.fromEntries(
            Object.entries(sourceCode as SourceCodeDto).map(([key, value]) => [key, value.context])
          );

		await saveProject(projectDetails)

        console.log("Project details updated successfully")
	return {
		..._state
	}
}

export { updateProjectDetails }

