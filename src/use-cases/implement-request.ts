import { ChangeRequestDto } from "@dto/project"
import { getSourceCode, rebuildProject } from "@utils/project"
import Team from "@utils/team"

export async function implementRequest(changeRequest: ChangeRequestDto): Promise<any> {
	try {

        await Team.implement(changeRequest)
		return getSourceCode(changeRequest.project.projectId)
	} catch (error) {
		console.error("Error:", error)
	}
}