import fs from 'fs-extra';
import path from 'path';
import { exec } from 'child_process';
import { Project } from './dto/Project';

async function runCommand(command: string, cwd: string): Promise<void> {
    return new Promise((resolve, reject) => {
        exec(command, { cwd }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error running command: ${command}`);
                console.error(`Stderr: ${stderr}`);
                reject(error);
                return;
            }
            console.log(`Stdout: ${stdout}`);
            resolve();
        });
    });
}

async function installDependencies(projectPath: string): Promise<void> {
    console.log(`Installing dependencies in ${projectPath}...`);
    await runCommand('yarn install', projectPath);
    console.log('Dependencies installed successfully.');
}

async function buildProject(projectPath: string): Promise<void> {
    console.log(`Building project in ${projectPath}...`);
    await runCommand('yarn build', projectPath);
    console.log('Project built successfully.');
}

async function setupNewProject(projectId: string): Promise<string> {
    try {
        const templatePath: string = path.join(__dirname, 'rspack-react-tailwind');
        const projectPath: string = path.join(__dirname, 'projects', projectId);

        // Copy React template to new project folder
        await fs.copy(templatePath, projectPath);
        console.log(`Project template copied to ${projectPath}`);

        // Install dependencies and build the project
        await installDependencies(projectPath);
        await buildProject(projectPath);

        return projectId;
    } catch (error) {
        console.error('Error setting up project:', error);
        throw error;
    }
}

async function getProjectSourceCode(projectId: string): Promise<{ [key: string]: string }> {
    const projectPath = path.join(__dirname, 'projects', projectId);
    const srcPath = path.join(projectPath, 'src');
    const packageJsonPath = path.join(projectPath, 'package.json');
    const sourceCode: { [key: string]: string } = {};

    try {
        if (await fs.pathExists(packageJsonPath)) {
            sourceCode['package.json'] = await fs.readFile(packageJsonPath, 'utf-8');
        }

        if (await fs.pathExists(srcPath)) {
            const files = await fs.readdir(srcPath);
            for (const file of files) {
                const filePath = path.join(srcPath, file);
                if ((await fs.stat(filePath)).isFile()) {
                    sourceCode[`src/${file}`] = await fs.readFile(filePath, 'utf-8');
                }
            }
        }
    } catch (error) {
        console.error('Error fetching source code:', error);
        throw error;
    }

    return sourceCode;
}

async function updateProjectSourceCode(project: Project): Promise<void> {
    const projectPath = path.join(__dirname, 'projects', project.projectId);

    try {
        for (const [filePath, fileContent] of Object.entries(project.sourceCode)) {
            const fullPath = path.join(projectPath, filePath);
            await fs.ensureFile(fullPath);
            await fs.writeFile(fullPath, fileContent, 'utf-8');
        }

        if ('package.json' in project.sourceCode) {
            await installDependencies(projectPath);
        }

        await buildProject(projectPath);
    } catch (error) {
        console.error('Error updating project source code:', error);
        throw error;
    }
}

export { setupNewProject, getProjectSourceCode, updateProjectSourceCode };
