export interface InitializeReactModule {
	execute(projectId: string): Promise<void>
}