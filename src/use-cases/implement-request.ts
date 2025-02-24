import { ChangeRequestDto } from "@dto/project"
import { rebuildProject } from "@utils/project"
import Team from "@utils/team"

export async function implementRequest(changeRequest: ChangeRequestDto): Promise<any> {
	try {

        const newSourceCode = await Team.implement(changeRequest)
		await rebuildProject(newSourceCode)
	} catch (error) {
		console.error("Error:", error)
	}
}