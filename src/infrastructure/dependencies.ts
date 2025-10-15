import { PackageManager } from "@infrastructure/ports/package-manager"
import { CommentAndDevelopUseCase } from "@application/use-cases/task/comment-and-develop"
import { TaskExecutionController } from "./http/controllers/task-execution-controller"
import { DevelopUseCase } from "@application/use-cases/task/develop"
import { Develop } from "@domain/use-cases/task-execution/develop"

import { VersionControlSystem } from "@domain/ports/version-control-system"
import { Bundler } from "@domain/ports/bundlers/bundler"
import RspackBundler from "@infrastructure/adapters/bundlers/rspack-bundler"
import { FileSelectionFilter } from "@domain/ports/filesystem/file-selection-filter"
import { SourceCodeFilter } from "@infrastructure/adapters/filesystem/filters/source-code-filter"
import { DistFolderFilter } from "@infrastructure/adapters/filesystem/filters/dist-folder-filter"
import { Template } from "@domain/ports/templates/template"
import { RspackTemplate } from "@infrastructure/adapters/templates/rspack-template"
import { FileSystemPort } from "@domain/ports/filesystem/file-system"
import { LocalFileSystem } from "@infrastructure/adapters/filesystem/local-file-system"
import { YarnPackageManager } from "@infrastructure/adapters/package-managers/yarn-package-manager"
import { ReactDeveloper } from "@infrastructure/adapters/ai/openai/react-developer"
import { LocalDevEnvironment } from "@application/services/local-dev-environment"
import { DevEnvironment } from "@domain/ports/services/dev-environment"
import { JigJoyVCSAdapter } from "@infrastructure/adapters/jigjoy-vcs"
import { CommentAndDevelop } from "@domain/use-cases/task-execution/comment-and-develop"
import { Agent } from "@domain/agent"

// Controllers
export const taskExecutionController = new TaskExecutionController()

// Services
export const fileSystem: FileSystemPort = new LocalFileSystem()
export const yarnPackageManager: PackageManager = new YarnPackageManager(fileSystem)


// Filters
export const sourceCodeFilter: FileSelectionFilter = new SourceCodeFilter(fileSystem)
export const distFolderFilter: FileSelectionFilter = new DistFolderFilter(fileSystem)

// Bundlers
export const rspackBundler: Bundler = new RspackBundler(yarnPackageManager, distFolderFilter)

// Templates
export const rspackTemplate: Template = new RspackTemplate(sourceCodeFilter, distFolderFilter)


export const versionControlSystem: VersionControlSystem = new JigJoyVCSAdapter()
export const localDevEnvironment: DevEnvironment = new LocalDevEnvironment(rspackBundler, fileSystem)

// Agents
export const reactDeveloper: Agent = new ReactDeveloper(localDevEnvironment)

// Use Cases
export const develop: Develop = new DevelopUseCase(taskRepository, taskExecutionRepository, versionControlSystem, projectRepository, reactDeveloper)
export const leaveComment: CommentAndDevelop = new CommentAndDevelopUseCase(taskRepository)