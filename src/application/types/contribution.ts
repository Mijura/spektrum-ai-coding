export enum ContributionType {
	STARTED_WORK = "STARTED_WORK",
	FINISHED_WORK = "FINISHED_WORK",
}
export type Contribution = {
	taskId: string
	workerId: string
	message: string
	type: ContributionType
}