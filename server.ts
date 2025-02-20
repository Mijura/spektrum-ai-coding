import express, { NextFunction, Request, Response } from "express";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from 'uuid';
import { getProjectSourceCode, setupNewProject, updateProjectSourceCode } from "./util";
import { Project } from "./dto/Project";

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Project intialization
app.post("/", async (req: Request, res: Response) => {
  try {
    const projectId = uuidv4();
    await setupNewProject(projectId);
    res.json({ message: "Project built successfully.", projectId });
  } catch (error) {
    console.error("Error setting up project:", error);
    res.status(500).json({ error: `Error setting up project: ${error}` });
  }
});

// Middleware to serve static files
app.use("/:projectId", (req: Request, res: Response, next: NextFunction) => {
  const projectPath = path.join(__dirname, `projects/${req.params.projectId}/dist`);

  if (fs.existsSync(projectPath)) {
    express.static(projectPath)(req, res, next);
  } else {
    res.status(404).send("Project not found");
  }
});

// Serve index.html when accessing `/projectId`
app.get("/:projectId", (req: Request, res: Response) => {
  const projectPath = path.join(
    __dirname,
    `projects/${req.params.projectId}/dist/index.html`
  );

  if (fs.existsSync(projectPath)) {
    res.sendFile(projectPath);
  } else {
    res.status(404).send("Project not found");
  }
});

app.get('/:projectId/source', async (req: Request, res: Response) => {
  try {
      const { projectId } = req.params;
      const sourceCode = await getProjectSourceCode(projectId);
      res.json({ sourceCode });
  } catch (error) {
      res.status(500).json({ error: `Error fetching source code: ${error}` });
  }
});

app.post('/rebuild', async (req: Request, res: Response) => {
  try {
      const project: Project = req.body;
      await updateProjectSourceCode(project);
      res.json({ message: 'Project rebuilt successfully.', projectId: project.projectId });
  } catch (error) {
      res.status(500).json({ error: `Error rebuilding project: ${error}` });
  }
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${port}`);
});
