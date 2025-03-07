import { SourceCodeDto } from "@application/dto/source-code"
import { RootAnnotation } from "../langgraph-generate-code"
import { projectStorage } from "@infrastructure/config/dependencies"

const updateProjectDetails = async (_state: typeof RootAnnotation.State): Promise<typeof RootAnnotation.State> => {
	const { projectDetails, sourceCode } = _state

	projectDetails.files = Object.fromEntries(
		Object.entries(sourceCode as SourceCodeDto).map(([key, value]) => [key, value.context])
	)

	const savedProject = await projectStorage.save(projectDetails)

	console.log("\n\nProject details updated successfully")
	return {
		..._state,
		projectDetails: savedProject
	}
}

export { updateProjectDetails }
