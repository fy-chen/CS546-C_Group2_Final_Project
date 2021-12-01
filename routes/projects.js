const express = require("express");
const { tickets } = require("../data");
const router = express.Router();
const data = require("../data");
const projectsData = data.projects;

let isAppropriateString = (string, name) => {
  if (!string) {
    throw new Error(`${name} not provided`);
  }
  if (typeof string !== "string") {
    throw new Error(`Provided ${name} is not a string`);
  }
  if (string.trim().length === 0) {
    throw new Error(`Provided ${name} cannot be an empty string`);
  }
};

router.get("/", async (req, res) => {
  res.render("pages/projectPage");
});

router.get("/:id", async (req, res) => {
  try {
    const project = projectsData.get(req.params.id);
    // res.render("/pages/projectPage", { project });
    res.json(project);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.get("users/:id", async (req, res) => {
  try {
    const createdProjects = await projectsData.getProjectsByUser(req.params.id);
    res.render("pages/projectPage", { createdProjects: createdProjects });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.get("/create", async (req, res) => {
  try {
    res.render("pages/projectPage");
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/create", async (req, res) => {
  let projectData = req.body;
  try {
    isAppropriateString(projectData.ProjectName, "Project Name");
    isAppropriateString(projectData.description, "description");
    const newProject = projectsData.create(
      projectData.ProjectName,
      projectData.description
    );
    res.render("pages/projectPage", { project: project });
    res.json(newProject);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/search", async (req, res) => {
  try {
    if (!req.body.phrase || req.body.phrase.trim().length === 0) {
      throw new Error(`Provided search phrase is empty`);
    }
  } catch (e) {
    res.status(403).json({ error: e });
  }

  try {
    const projectList = projectsData.searchProject(req.body.phrase);
    if (projectList.length === 0) {
      res.render("pages/projectPage", { notFound: true });
    } else {
      res.render("pages/projectPage", { projects: projectList });
    }
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleteInfo = await projectsData.remove(req.params.id);
    res.status(200).json(deleteInfo);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

module.exports = router;
