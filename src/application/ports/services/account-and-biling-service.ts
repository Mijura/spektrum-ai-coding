export interface AccountAndBillingService {
	charge(accountId: string, amount: number): Promise<number>
}
