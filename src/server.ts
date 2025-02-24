import express, { NextFunction, Request, Response } from "express";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import {
  getProjectSourceCode,
  setupNewProject,
  updateProjectSourceCode,
} from "./util";
import { Project } from "./dto/Project";

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Include OPTIONS
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Allow these headers

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.sendStatus(204); // No content for preflight requests
    return
  }

  next();
});

// Project intialization
app.post("/project/new", async (req: Request, res: Response) => {
  try {
    const projectId = uuidv4();
    await setupNewProject(projectId);
    res.json({ message: "Project built successfully.", projectId });
  } catch (error) {
    console.error("Error setting up project:", error);
    res.status(500).json({ error: `Error setting up project: ${error}` });
  }
});

app.get("/project/fetch/:projectId", async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const sourceCode = await getProjectSourceCode(projectId);
    const project: Project = { projectId, sourceCode };
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: `Error fetching source code: ${error}` });
  }
});

app.put("/project/update", async (req: Request, res: Response) => {
  try {
    const project: Project = req.body;

    console.log(project)
    await updateProjectSourceCode(project);
    res.json({
      message: "Project rebuilt successfully.",
      projectId: project.projectId,
    });
  } catch (error) {
    console.error("Error rebuilding project:", error);
    res.status(500).json({ error: `Error rebuilding project: ${error}` });
  }
});

// Middleware to serve static files
app.use("/:projectId", (req: Request, res: Response, next: NextFunction) => {
  const projectPath = path.join(
    __dirname,
    `projects/${req.params.projectId}/dist`
  );

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

// Start the server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${port}`);
});
