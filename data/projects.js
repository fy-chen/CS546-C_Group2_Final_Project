const mongoCollections = require("../config/mongoCollections");
const projects = mongoCollections.projects;
let { ObjectId } = require("mongodb");
let usersData = require("./users");
let ticketsData = require("./tickets");
const tickets = mongoCollections.tickets;

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
  if (isNaN(role)) {
    throw new Error("Provided role should not be NaN");
  }
  // if (Number(role) !== 1 && Number(role) !== 2 && Number(role) !== 3) {
  //   throw new Error("Provided role not valid");
  // }

  if (role == 1) {
    projectsCollection = await projects();

    let newProject = {
      projectName: projectName,
      description: description,
      users: [],
      tickets: [],
    };

    const insertInfo = await projectsCollection.insertOne(newProject);
    if (insertInfo.insertedCount === 0) {
      throw new Error(`Could not add a project`);
    }
    return await get(insertInfo.insertedId.toString());
  } else {
    throw new Error(`You don't have Admin access`);
  }
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

  return { success: true };
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

async function update(id, projectName, description, role) {
  let parsedId = toObjectId(id, "ProjectId");
  isAppropriateString(projectName, "Project Name");
  isAppropriateString(description, "Description");
  if (isNaN(role)) {
    throw new Error("Provided role should not be NaN");
  }
  if (role == 1) {
    projectsCollection = await projects();
    let updatedProject = {
      projectName: projectName,
      description: description,
    };

    const updatedInfo = await projectsCollection.updateOne(
      { _id: parsedId },
      { $set: updatedProject }
    );
    if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount) {
      throw new Error(`Could not update project of id ${id}`);
    }
    return await get(id);
  } else {
    throw new Error(`You don't have Admin access`);
  }
}

async function addUser(projectId, userId) {
  let parsedUserId = toObjectId(userId, "UserId;");
  let parsedProjectId = toObjectId(projectId, "ProjectId;");
  projectsCollection = await projects();

  await get(projectId);
  const user = await usersData.get(userId);

  let userInfo = {
    _id: userId,
    userName: user.userName,
  };

  const updatedInfo = await projectsCollection.updateOne(
    { _id: parsedProjectId },
    { $addToSet: { users: userId } }
  );

  if (updatedInfo == null) {
    throw "could not add user successfully";
  }

  return await get(projectId);
}

async function addTickets(projectId, ticketId) {
  let parsedTicketId = toObjectId(ticketId, "UserId;");
  let parsedProjectId = toObjectId(projectId, "ProjectId");
  projectsCollection = await projects();

  await get(projectId);

  TicketsCollection = await tickets();

  let ticket = await TicketsCollection.findOne({ _id: parsedTicketId });
  if (ticket === null) throw 'No ticket with that id';

  ticket._id = ticket._id.toString();

  let ticketInfo = {
    _id: ticketId,
    title: ticket.title,
  };

  const updatedInfo = await projectsCollection.updateOne(
    { _id: parsedProjectId },
    { $addToSet: { tickets: ticketId } }
  );

  if (updatedInfo.modifiedCount === 0) {
    throw "could not add Ticket successfully";
  }

  return await get(projectId);
}

async function searchProject(phrase) {
  isAppropriateString(phrase, "Search phrase");

  projectsCollection = await projects();

  let projectList = await projectsCollection
    .find({
      $or: [
        { projectName: { $regex: ".*" + phrase + ".*", $options: "i" } },
        { description: { $regex: ".*" + phrase + ".*", $options: "i" } },
      ],
    })
    .toArray();
  console.log(await projectList);
  for (let i = 0; i < projectList.length; i++) {
    projectList[i]._id = projectList[i]._id.toString();
  }

  return projectList;
}

async function getProjectsByUser(userId) {
  let parsedId = toObjectId(userId, "userId");
  projectsCollection = await projects();
  let projectList = [];

  projectList = await projectsCollection.find({ users: userId }).toArray();
  for (let i = 0; i < projectList.length; i++) {
    projectList[i]._id = projectList[i]._id.toString();
  }

  return projectList;
}

async function getProjectsByTicket(ticketId) {
  let parsedId = toObjectId(ticketId, "ticketId");
  projectsCollection = await projects();
  let projectList = [];

  projectList = await projectsCollection.find({ tickets: ticketId }).toArray();
  for (let i = 0; i < projectList.length; i++) {
    projectList[i]._id = projectList[i]._id.toString();
  }
}

async function removeUser(projectId, userId) {
  let parsedProjectId = toObjectId(projectId, "projectId");
  let parsedUserId = toObjectId(userId, "userId");

  projectsCollection = await projects();
  await get(projectId);

  const user = await usersData.get(userId);
  const updatedInfo = await projectsCollection.updateOne(
    { _id: parsedProjectId },
    { $pull: { users: userId } }
  );

  if (updatedInfo.modifiedCount === 0) {
    throw new Error(`Could not remove user successfully.`);
  }

  return await get(projectId);
}

module.exports = {
  isAppropriateString,
  toObjectId,
  create,
  get,
  getAll,
  remove,
  rename,
  update,
  addUser,
  addTickets,
  searchProject,
  getProjectsByUser,
  getProjectsByTicket,
  removeUser,
};
