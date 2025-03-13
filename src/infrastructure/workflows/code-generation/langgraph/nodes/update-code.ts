import { RootAnnotation } from "../state/root-annotation"


const updateCode = async (_state: typeof RootAnnotation.State): Promise<typeof RootAnnotation.State> => {
	const { project, sourceCode, frontendDevelopmentService } = _state


	try {

		await frontendDevelopmentService.updateSourceCode(project.id, sourceCode)
		await frontendDevelopmentService.installDependencies(project.id)
		await frontendDevelopmentService.buildProject(project.id)

	} catch (error) {
		console.error("Error writing files:", error)
		throw error
	}

	return {
		..._state,
	}
}

export { updateCode }
