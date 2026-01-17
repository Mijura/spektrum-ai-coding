export declare enum ModuleType {
	FRONTEND = "FRONTEND",
}

export declare enum EnvironmentType {
	DEV = "DEV",
	PROD = "PROD",
}

export type DeploymentRequest = {
	moduleId: string
	repositoryId: string
	moduleType: ModuleType
	environmentType: EnvironmentType
	setAsEntryPoint?: boolean
}
