import { AccountAndBillingService } from "@app/ports/services/account-and-biling-service"
import { Auth } from "@heksagon/app"
import { SpektrumClient } from "@jigjoy-ai/spektrum-client"
import { UserData } from "@jigjoy-ai/auth"

export class JigJoyAccountAndBillingService implements AccountAndBillingService {
	private readonly spektrumClient: SpektrumClient
	constructor() {
		const JIGJOY_API_ENDPOINT = process.env.JIGJOY_API_ENDPOINT || ""
		this.spektrumClient = new SpektrumClient(`${JIGJOY_API_ENDPOINT}`, { kind: "internal" , token: process.env.INTERNAL_SERVICE_TOKEN || "" })
	}

	async charge(amount: number, auth: Auth<UserData>): Promise<number> {
		const response = await this.spektrumClient.account.chargeAccount(amount, auth)
		return response.totalCostUsd
	}
}
