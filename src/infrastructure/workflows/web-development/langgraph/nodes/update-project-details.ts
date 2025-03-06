import { SourceCodeDto } from "@application/dto/source-code"
import { RootAnnotation } from "../langgraph-web-development"


const updateProjectDetails = async (_state: typeof RootAnnotation.State): Promise<typeof RootAnnotation.State> => {
	const { projectDetails, sourceCode } = _state

	projectDetails.files = Object.fromEntries(
		Object.entries(sourceCode as SourceCodeDto).map(([key, value]) => [key, value.context])
	)

	await saveProject(projectDetails)

	console.log("\n\nProject details updated successfully")
	return {
		..._state,
	}
}

export { updateProjectDetails }
