import express, { NextFunction, Request, Response } from "express";
import { buildSourceCode } from "./build";
import path from "path";
import fs from "fs";

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Example of a POST route
app.post("/build", async (req: Request, res: Response) => {
  const { sourceCode, projectId } = req.body;

  const response = await buildSourceCode(sourceCode, projectId);
  res.send(response);
});

// Middleware to serve static files
app.use("/:projectId", (req: Request, res: Response, next: NextFunction) => {
  const projectPath = path.join(__dirname, `/${req.params.projectId}`);

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
    `/${req.params.projectId}/index.html`
  );

  if (fs.existsSync(projectPath)) {
    res.sendFile(projectPath);
  } else {
    res.status(404).send("Project not found");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
