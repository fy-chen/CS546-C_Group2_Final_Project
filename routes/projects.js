const express = require("express");
const router = express.Router();
const data = require("../data");
const projectsData = data.projects;
const ticketsData = data.tickets;
const users = data.users;
const xss = require("xss");
const { projects } = require("../config/mongoCollections");

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
  if (!xss(req.session.user)) {
    res.status(401).json({ message: "Unauthorized request" });
    return;
  }
  // res.render("pages/projectPage");
  try {
    const projectList = await projectsData.getAll();
    return res.status(200).json(projectList);
  } catch (e) {
    return res.status(404).json({ error: e });
  }
});

router.get("/:id", async (req, res) => {
  if (!xss(req.session.user)) {
    res.status(401).json({ message: "Unauthorized request" });
    return;
  }
  try {
    projectsData.toObjectId(xss(req.params.id));
  } catch (e) {
    res.status(500).json({ error: e });
  }

  try {
    const project = await projectsData.get(xss(req.params.id));
    // res.render("/pages/projectPage", { project });
    return res.json(project);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router.get("/users/:id", async (req, res) => {
  //reuqires login
  if (!xss(req.session.user)) {
    res.status(401).json({ message: "Unauthorized request" });
    return;
  }
  try {
    projectsData.toObjectId(xss(req.params.id));
  } catch (e) {
    res.status(500).json({ error: e });
  }

  try {
    const createdProjects = await projectsData.getProjectsByUser(
      xss(req.session.id)
    );
    // res.render("pages/projectPage", { createdProjects: createdProjects });
    return res.json(createdProjects);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router.post("/create", async (req, res) => {
  if (!xss(req.session.user) || xss(req.session.user.userRole) !== 1) {
    res.status(401).json({ message: "Unauthorized request" });
    return;
  }
  let projectData = req.body;
  // projectData.role = 1;
  projectData.role = xss(req.session.user.userRole);

  try {
    if (!xss(req.session.user) || xss(req.session.user.userRole) !== 1) {
      res.status(401).json({ message: "Unauthorized request" });
      return;
    }
    isAppropriateString(projectData.projectName, "Project Name");
    isAppropriateString(projectData.description, "description");

    if (
      projectData.projectName.length < 4 ||
      projectData.projectName.length > 30
    ) {
      throw new Error(
        `Provided project name should be at least 4 characters long and at most 30 characters long`
      );
    }

    if (
      projectData.description.length < 4 ||
      projectData.description.length > 100
    ) {
      `Provided description should be at least 4 characters long and at most 100 characters long`;
    }

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
  if (!xss(req.session.user)) {
    res.status(401).json({ message: "Unauthorized request" });
    return;
  }
  try {
    if (!xss(req.body.phrase) || xss(req.body.phrase.trim().length) === 0) {
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
  if (!xss(req.session.user)) {
    res.status(401).json({ err: "Unauthorized!" });
    return;
  }
  try {
    projectsData.toObjectId(xss(req.params.id));
  } catch (e) {
    res.status(500).json({ error: e });
    return;
  }
  try {
    const deleteInfo = await projectsData.remove(xss(req.params.id));
    return res.status(200).json(deleteInfo);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router.put("/update/:id", async (req, res) => {
  if (!xss(req.session.user) || xss(req.session.user.userRole) !== 1) {
    res.status(401).json({ message: "Unauthorized request" });
    return;
  }
  let projectData = req.body;
  projectData.role = xss(req.session.user.userRole);
  try {
    projectsData.toObjectId(xss(req.params.id));
  } catch (e) {
    return res.status(500).json({ error: e });
  }

  try {
    const project = await projectsData.get(xss(req.params.id));
  } catch (e) {
    return res.status(404).json({ error: "No projects found on this id." });
  }
  try {
    const updatedProject = await projectsData.update(
      xss(req.params.id),
      projectData.projectName,
      projectData.description,
      projectData.role
    );
    return res.status(200).json(updatedProject);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// router.get()

module.exports = router;
