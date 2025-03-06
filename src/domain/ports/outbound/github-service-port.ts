export interface GithubServicePort {
	cloneTemplate(projectPath: string): Promise<void>
}
