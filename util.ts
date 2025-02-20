import fs from "fs-extra";
import path from "path";
import { exec } from "child_process";

async function setupNewProject(projectId: string): Promise<void> {
  const templatePath: string = path.join(__dirname, "rspack-react-tailwind");
  const projectPath: string = path.join(__dirname, "projects", projectId);

  // Copy React template to new project folder
  await fs.copy(templatePath, projectPath);
  console.log(`Project template copied to ${projectPath}`);

  // Install dependencies
  await runCommand("yarn install", projectPath);
  console.log("Dependencies installed");

  // Build the project
  await runCommand("yarn build", projectPath);
  console.log("Project built successfully");
}

function runCommand(command: string, cwd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing ${command}:`, stderr);
        return reject(error);
      }
      console.log(stdout);
      resolve(stdout);
    });
  });
}

export { setupNewProject };
