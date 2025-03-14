import { projectStorage } from "@infrastructure/config/dependencies"
import { RootAnnotation } from "../state/root-annotation"
import { ProjectMapper } from "@domain/mappers/project-mapper"

const updateProject = async (_state: typeof RootAnnotation.State): Promise<typeof RootAnnotation.State> => {
	const { project } = _state

	// project.files = Object.fromEntries(
	// 	Object.entries(sourceCode as SourceCode).map(([key, value]) => [key, value.context])
	// )
	const projectToSave = ProjectMapper.toDomain(project)
	const savedProject = await projectStorage.save(projectToSave)

	console.log("\n\nProject details updated successfully")
	return {
		..._state,
		project: savedProject
	}
}

export { updateProject }