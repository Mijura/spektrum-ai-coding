import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export interface AccountAndBillingService {
	charge(amount: number, auth: Auth<UserData>): Promise<number>
	getAccountBalance(auth: Auth<UserData>): Promise<number>
}
