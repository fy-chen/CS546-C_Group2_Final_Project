const mongoCollections = require("../config/mongoCollections");
const projects = mongoCollections.projects;
let { ObjectId } = require("mongodb");

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

let toObjectId = (id, name) => {
  isAppropriateString(id, "ProjectId");

  try {
    parsedId = ObjectId(id);
  } catch (e) {
    throw `provided ${name} is not a valid ObjectId , it must be a single String of 12 bytes or a string of 24 hex characters`;
  }

  return parsedId;
};

async function create(projectName, description, role) {
  isAppropriateString(projectName, "Project Name");
  isAppropriateString(description, "Description");
  if (isNaN(Number(role))) {
    throw new Error("Provided role should not be NaN");
  }
  if (Number(role) !== 1 || Number(role) !== 2 || Number(role) !== 3) {
    throw new Error("Provided priority not valid");
  }

  if (role == 1) {
    projectsCollection = await projects();

    let newProject = {
      projectName: projectName,
      description: description,
      user: [],
      tickets: [],
    };

    const insertInfo = await projectsCollection.insertOne(newProject);
    if (insertInfo.insertedCount === 0) {
      throw new Error(`Could not add a project`);
    }
  } else throw new Error(`You don't have Admin access`);

  return await get(insertInfo.insertedId.toString());
}

async function get(id) {
  let parsedId = toObjectId(id, "ProjectId");
  projectsCollection = await projects();

  let project = await projectsCollection.findOne({ _id: parsedId });
  if (project === null) {
    throw new Error(`No Project found for id ${id}`);
  }

  project._id = project._id.toString();
  return project;
}

async function getAll() {
  if (arguments.length > 0) {
    throw new Error("There should not be variables provided");
  }
  projectsCollection = await projects();
  projectList = await projectsCollection.find({}).toArray();
  for (let i = 0; i < projectList.length; i++) {
    projectList[i]._id = projectList[i]._id.toString();
  }
  return projectList;
}

async function remove(id) {
  let parsedId = toObjectId(id, "ProjectId");
  projectsCollection = await projects();

  let project = await get(id);
  const deletionInfo = await projectsCollection.deleteOne({ _id: parsedId });

  if (deletionInfo.deletedCount === 0) {
    throw new Error(`Could not remove Project of Id ${id}`);
  }

  project._id = project._id.toString();
  return `${project.projectName} has been deleted successfully.`;
}

async function rename(id, newProjectName) {
  isAppropriateString(projectName);
  id = ObjectId(id);
  projectsCollection = await projects();

  let project = await get(id.toString());
  if (project.projectName == newProjectName) {
    throw new Error(
      "New Project name is same as current one, Please try Different Projet Name."
    );
  }

  let updatedProject = {
    projectName: newProjectName,
  };

  let updatedInfo = await projectsCollection.updateOne(
    { _id: id },
    { $set: updatedProject }
  );

  if (updatedInfo.modifiedCount === 0) {
    throw new Error("Could not update name of a Project.");
  }

  project._id = project._id.toString();
  return await get(id.toString());
}

async function update(id, projectName, description) {
  id = ObjectId(id);
  projectsCollection = await projects();
  let updatedProject = {
    projectName: projectName,
    description: description,
  };

  const updatedInfo = await projectsCollection(
    updateOne({ _id: id }, { $set: updatedProject })
  );

  if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount) {
    throw new Error(`Could not update project of id ${id}`);
  }
  return await get(id);
}

module.exports = {
  create,
  get,
  getAll,
  remove,
  rename,
  update,
};
