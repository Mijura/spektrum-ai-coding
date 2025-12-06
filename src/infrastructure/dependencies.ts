import { PackageManager } from "@infrastructure/ports/package-manager"
import { DevelopUseCase } from "@application/use-cases/develop"
import { Develop } from "@application/ports/inbound/develop"

import { Bundler } from "@domain/ports/bundlers/bundler"
import RspackBundler from "@infrastructure/adapters/bundlers/rspack-bundler"
import { FileSelectionFilter } from "@domain/ports/filesystem/file-selection-filter"
import { SourceCodeFilter } from "@infrastructure/adapters/filesystem/filters/source-code-filter"
import { DistFolderFilter } from "@infrastructure/adapters/filesystem/filters/dist-folder-filter"
import { Template } from "@domain/ports/templates/template"
import { RspackTemplate } from "@infrastructure/adapters/templates/rspack-template"
import { YarnPackageManager } from "@infrastructure/adapters/package-managers/yarn-package-manager"
import { LocalDevEnvironment } from "@application/services/local-dev-environment"
import { DevEnvironment } from "@domain/ports/services/dev-environment"
import { ProjectArtifactsClient } from "@jigjoy-io/project-artifacts-client"
import { AICodingController } from "./http/controllers/ai-coding-controller"
import { InitializeReactModuleUseCase } from "@application/use-cases/initialize-react-module"
import { ModuleController } from "./http/controllers/module-controller"
import { FileSystemPort } from "@application/ports/outbound/file-system"
import { LocalFileSystem } from "@infrastructure/adapters/filesystem/local-file-system"
import { CodebaseRepositoryPort } from "@application/ports/outbound/codebase-repository"
import { DynamoDBCodebaseRepository } from "./storage/codebase-repository"

// Controllers
export const aiCodingController = new AICodingController()
export const moduleController = new ModuleController()

// Services
export const fileSystem: FileSystemPort = new LocalFileSystem()
export const yarnPackageManager: PackageManager = new YarnPackageManager()

// Filters
export const sourceCodeFilter: FileSelectionFilter = new SourceCodeFilter(fileSystem)
export const distFolderFilter: FileSelectionFilter = new DistFolderFilter(fileSystem)

// Bundlers
export const rspackBundler: Bundler = new RspackBundler(yarnPackageManager, distFolderFilter)

// Templates
export const rspackTemplate: Template = new RspackTemplate(sourceCodeFilter, distFolderFilter)

export const localDevEnvironment: DevEnvironment = new LocalDevEnvironment(rspackBundler, fileSystem)

// SDKs
export const projectArtifactsClient = new ProjectArtifactsClient()
export const codebaseRepository: CodebaseRepositoryPort = new DynamoDBCodebaseRepository()

// Use Cases
export const develop: Develop = new DevelopUseCase(projectArtifactsClient, localDevEnvironment)
export const initializeReactModule = new InitializeReactModuleUseCase(projectArtifactsClient, rspackTemplate, codebaseRepository)