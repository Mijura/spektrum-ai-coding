// src/infrastructure/utils/CommandRunner.ts
import { spawn } from "child_process"

export interface CommandResult {
	success: boolean
	stdout: string
	stderr: string
	exitCode: number
}

export async function runCommand(command: string, cwd: string, contextMessage?: string): Promise<CommandResult> {
	return new Promise((resolve) => {
		const [cmd, ...args] = command.split(" ")
		const process = spawn(cmd, args, { cwd, stdio: "pipe", shell: true })

		let stdout = contextMessage ? `${contextMessage}\n` : ""
		let stderr = ""

		process.stdout?.on("data", (data) => {
			const output = data.toString()
			stdout += output
			console.log(output.trim()) // Real-time output
		})

		process.stderr?.on("data", (data) => {
			const errorOutput = data.toString()
			stderr += errorOutput
			console.error(errorOutput.trim()) // Real-time error logs
		})

		process.on("error", (error) => {
			stderr += `\nProcess error: ${error.message}`
		})

		process.on("close", (code) => {
			const success = code === 0
			const finalMessage = success
				? `✅ Command "${command}" executed successfully.`
				: `❌ Command "${command}" failed with exit code ${code}.`

			if (success) {
				stdout += `\n${finalMessage}`
			} else {
				stderr += `\n${finalMessage}`
			}

			resolve({
				success,
				stdout: stdout.trim(),
				stderr: stderr.trim(),
				exitCode: code ?? -1,
			})
		})
	})
}
