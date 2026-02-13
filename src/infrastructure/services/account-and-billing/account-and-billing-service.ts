import { AccountAndBillingService } from "@app/ports/services/account-and-biling-service"
import { PlatformSDK } from "@jigjoy-ai/platform-sdk"

export class JigJoyAccountAndBillingService implements AccountAndBillingService {
	private readonly jigjoyClient: PlatformSDK
	constructor() {
		const JIGJOY_API_ENDPOINT = process.env.JIGJOY_API_ENDPOINT || ""
		this.jigjoyClient = new PlatformSDK(`${JIGJOY_API_ENDPOINT}`)
	}

	async charge(accountId: string, amount: number): Promise<number> {
		const response = await this.jigjoyClient.account.chargeAccount(accountId, amount)
		return response.totalCostUsd
	}
}
