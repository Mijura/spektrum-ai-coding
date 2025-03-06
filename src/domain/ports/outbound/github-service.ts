export interface GithubService {
	cloneTemplate(projectPath: string): Promise<void>
}
