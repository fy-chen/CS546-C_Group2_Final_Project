const mongoCollections = require("../config/mongoCollections");
const projects = mongoCollections.projects;
let { ObjectId } = require("mongodb");

async function create(projectName, description) {
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

  return await get(insertInfo.insertedId.toString());
}

async function get(id) {
  let id = toObjectId(id);
  projectsCollection = await projects();

  let project = await projectsCollection.findOne({ _id: id });
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
  id = ObjectId(id);
  projectsCollection = await projects();

  let project = await get(id.toString());
  const deletionInfo = await projectsCollection.deleteOne({ _id: id });

  if (deletionInfo.deletedCount === 0) {
    throw new Error(`Could not remove Project of Id ${id}`);
  }

  project._id = project._id.toString();
  return `${project.projectName} has been deleted successfully.`;
}

async function rename(id, newProjectName) {
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
