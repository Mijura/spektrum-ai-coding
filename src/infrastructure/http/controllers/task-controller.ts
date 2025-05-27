import { Request, Response } from "express"
import { TaskDtoMapper } from "@application/mappers/task-dto-mapper"
import { leaveComment, frontendDevelopmentWorkflow, updateTaskDescription, fetchTasks, createTask, updateTaskTitle } from "@infrastructure/dependencies"
import { TaskDto } from "@application/dto/task"
import { Task } from "@domain/entities/task"

export class TaskController {

	constructor() {}

	async createTask(req: Request, res: Response): Promise<void> {
		try {
			const { projectId, title, description } = req.body
			const task: Task = await createTask.execute(projectId, title, description)

			res.status(201).json(task)
		} catch (error) {
			console.error("Error creating task:", error)
			res.status(500).json({ message: "Error creating task." })
		}
	}

	async updateTaskTitle(req: Request, res: Response): Promise<void> {
		try {
			const taskDto: TaskDto = req.body
			const updatedTask: Task = await updateTaskTitle.execute(taskDto)
			res.status(200).json(updatedTask)
		} catch (error) {
			// TODO: Handle Task Not Found
			console.error("Error updating task title:", error)
			res.status(500).json({ message: "Error updating task title." })
		}
    }

	async updateTaskDescription(req: Request, res: Response): Promise<void> {
		try {
			const taskDto: TaskDto = req.body
			const updatedTask: Task = await updateTaskDescription.execute(taskDto)
			res.status(200).json(updatedTask)
		} catch (error) {
			// TODO: Handle Task Not Found
			console.error("Error updating task description:", error)
			res.status(500).json({ message: "Error updating task description." })
		}
	}

	async fetchTasks(req: Request, res: Response): Promise<any> {

		try {
			const { projectId } = req.params
			console.log(`Fetching all tasks for project: ${projectId}`)
			const tasks: Task[] = await fetchTasks.execute(projectId)
			const taskDtos: TaskDto[] = TaskDtoMapper.toDtos(tasks)
			res.json(taskDtos)
		} catch (error) {
			// TODO: Handle Project Not Found
			console.error("Error fetching tasks:", error)
			res.status(500).json({ message: "Error fetching tasks" })
		}

    }

	async leaveCommentAndRunFrontendDevelopmentWorkflow(req: Request, res: Response): Promise<void> {
		try {
			const { taskId, authorId, commentText } = req.body
			const task = await leaveComment.execute(taskId, authorId, commentText)
			frontendDevelopmentWorkflow.run(task, authorId)
			res.status(200).json(task)
		} catch (error) {
			console.error("Error adding comment:", error)
			res.status(500).json({ message: "Error adding comment." })
		}
	}


}
