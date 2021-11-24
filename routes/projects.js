const express = require("express");
const router = express.Router();
const data = require("../data");
const projectsData = data.projects;

router.get("/", async (req, res) => {
  res.render("pages/projectPage");
});

router.get("/:id", async (req, res) => {
  try {
    const project = projectsData.get(req.params.id);
    res.render("/pages/projectPage", { project });
    // res.status(200).json(project);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/create", async (req, res) => {
  try {
    const newProject = projectsData.create(
      req.body.projectName,
      req.body.description,
      req.body.role
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

module.exports = router;
