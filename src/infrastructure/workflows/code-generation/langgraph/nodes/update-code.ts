import { JigJoyActivitySDK } from "@honeycomb-app/jigjoy-sdk"
import { RootAnnotation } from "../state/root-annotation"


const updateCode = async (_state: typeof RootAnnotation.State): Promise<typeof RootAnnotation.State> => {
	const { project, sourceCode, frontendDevelopmentService } = _state
	const sdk = new JigJoyActivitySDK(process.env.JIGJOY_ENDPOINT)

	let buildSuccess = false
	let installSuccess = false
	try {

		await frontendDevelopmentService.updateSourceCode(project.id, sourceCode)
		installSuccess = await frontendDevelopmentService.installDependencies(project.id)
		buildSuccess = await frontendDevelopmentService.buildProject(project.id)

	} catch (error) {
		console.error("Error writing files:", error)
		throw error
	} finally {

		await sdk.ingestActivity({
			playerId: project.ownerId, 
			gameId: 'honeycomb', 
			type: 'development-activity', 
			data: {
				projectId: project.id,
				buildStatus: buildSuccess && installSuccess ? "success" : "failed",
			}
		})
	}

	return {
		..._state,
	}
}

export { updateCode }
