export interface ProjectUseCase<Input, Output> {
	execute(input: Input): Promise<Output>
}
