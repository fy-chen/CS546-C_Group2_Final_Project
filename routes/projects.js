const { response } = require("express");
const express = require("express");
const { tickets } = require("../data");
const router = express.Router();
const data = require("../data");
const projectsData = data.projects;
const xss = require("xss");

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
  // res.render("pages/projectPage");
  try {
    const projectList = await projectsData.getAll();
    return res.status(200).json(projectList);
  } catch (e) {
    return res.status(404).json({ error: e });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const project = await projectsData.get(xss(req.params.id));
    // res.render("/pages/projectPage", { project });
    return res.json(project);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const createdProjects = await projectsData.getProjectsByUser(
      xss(req.params.id)
    );
    // res.render("pages/projectPage", { createdProjects: createdProjects });
    return res.json(createdProjects);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router.post("/create", async (req, res) => {
  let projectData = req.body;
  // projectData.role = 1;
  projectData.role = req.session.user.userRole;
  try {
    isAppropriateString(projectData.projectName, "Project Name");
    isAppropriateString(projectData.description, "description");
    const newProject = await projectsData.create(
      projectData.projectName,
      projectData.description,
      projectData.role
    );
    // res.render("pages/projectPage", { project: project });
    return res.json(newProject);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router.post("/search", async (req, res) => {
  try {
    if (!req.body.phrase || req.body.phrase.trim().length === 0) {
      throw new Error(`Provided search phrase is empty`);
    }
  } catch (e) {
    return res.status(403).json({ error: e });
  }

  try {
    const projectList = await projectsData.searchProject(xss(req.body.phrase));
    if (projectList.length === 0) {
      return res.status(200).send([]);
      // res.render("pages/projectPage", { notFound: true });
    } else {
      return res.status(200).send(projectList);
      // res.render("pages/projectPage", { projects: projectList });
    }
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleteInfo = await projectsData.remove(xss(req.params.id));
    return res.status(200).json(deleteInfo);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router.put("/update/:id", async (req, res) => {
  let projectData = req.body;
  projectData.role = req.session.user.userRole;
  try {
    const project = await projectsData.get(xss(req.params.id));
  } catch (e) {
    return res.status(404).json({ error: "No projects found on this id." });
  }
  try {
    const updatedProject = await projectsData.update(
      req.params.id,
      projectData.projectName,
      projectData.description,
      projectData.role
    );
    return res.status(200).json(updatedProject);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

module.exports = router;
