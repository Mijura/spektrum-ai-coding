
import { ChangeRequestDto } from "@dto/change-request"
import Team from "@utils/team"

export async function implementRequest(changeRequest: ChangeRequestDto): Promise<void> {
	try {

        await Team.implement(changeRequest)
	} catch (error) {
		console.error("Error:", error)
	}
}