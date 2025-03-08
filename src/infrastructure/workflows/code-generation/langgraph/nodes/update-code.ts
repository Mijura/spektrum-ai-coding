import { RootAnnotation } from "../state/root-annotation"


const updateCode = async (_state: typeof RootAnnotation.State): Promise<typeof RootAnnotation.State> => {
	const { projectDetails, sourceCode, frontendDevelopmentService } = _state


	try {

		await frontendDevelopmentService.updateSourceCode(projectDetails.id, sourceCode)
		await frontendDevelopmentService.installDependencies(projectDetails.id)
		await frontendDevelopmentService.buildProject(projectDetails.id)

	} catch (error) {
		console.error("Error writing files:", error)
		throw error
	}

	return {
		..._state,
	}
}

export { updateCode }
