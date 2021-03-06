const mongoCollections = require('../config/mongoCollections');
const tickets = mongoCollections.tickets;
let { ObjectId } = require('mongodb');
const projects = mongoCollections.projects;
let userData = require('./users');


let isAppropriateString = (string, name) => {
    if(!string) throw `${name} not provided`;
    if(typeof(string) !== 'string') throw `Provided ${name} is not a string`;
    else if(string.trim().length === 0) throw `Provided ${name} cannot be an empty string`;
}

let toObjectId = (id, name) => {
    
    isAppropriateString(id, name);
  
    try{
      parsedId = ObjectId(id);
    }catch(e){
      throw `provided ${name} is not a valid ObjectId , it must be a single String of 12 bytes or a string of 24 hex characters`;
    }
  
    return parsedId;
}
 
async function areAppropriateParameters (title, description, priority, project, errorType) {

    isAppropriateString(title, 'title');
    isAppropriateString(description, 'description');
    project = toObjectId(project, 'project');
    isAppropriateString(errorType, 'errorType');

    if(title.length < 4 || title.length > 30) throw 'Provided title should be at least 4 characters long and at most 30 characters long';

    if(description.length < 4 || description.length > 100) throw 'Provided description should be at least 4 characters long and at most 100 characters long';

    if(errorType.length < 4 || errorType.length > 30) throw 'Provided errorType should be at least 4 characters long and at most 30 characters long';

    if(isNaN(Number(priority))) throw 'Provided priority should not be NaN';
    else if(Number(priority) !== 1 && Number(priority) !== 2 && Number(priority) !== 3) throw 'Provided priority not valid';

    //should check if project exist
    projectsCollection = await projects();
    
    let thisproject = await projectsCollection.findOne({ _id: project });
    if (thisproject === null) {
        throw new Error(`No Project found for id ${id}`);
    }
}

let isValidcreatedTime = (createdTime) => {

    isAppropriateString(createdTime, 'createdTime');

    let now = Date.now();

    if(createdTime !== now) throw 'Provided createdTime is not today';

}

let isValidStatus = (status) => {

    isAppropriateString(status, 'status');

    //maybe more status

    if(status !== 'open' && status !== 'closed' && status !== 'ready_to_close') throw 'Provided status not valid';

}

async function create(title, description, priority, creator, project, errorType) {

    await areAppropriateParameters(title, description, priority, project, errorType);

    priority = Number(priority);

    isAppropriateString(creator, 'creator');

    await userData.get(creator);

    let createdTime = Date.now();

    TicketsCollection = await tickets();

    let newTicket = {
        title: title,
        description: description,
        priority: priority,
        creator: creator,
        project: project,
        status: 'open',
        createdTime: createdTime,
        errorType: errorType,
        assignedUsers: [],
        comments: [],
        history: [],
    };

    const insertInfo = await TicketsCollection.insertOne(newTicket);
    if (insertInfo.insertedCount === 0) throw 'Could not add ticket';

    let newId = insertInfo.insertedId.toString();

    return await get(newId);

}

async function get(id) {

    let parsedId = toObjectId(id, 'ticketId');

    TicketsCollection = await tickets();

    let ticket = await TicketsCollection.findOne({ _id: parsedId });
    if (ticket === null) throw 'No ticket with that id';

    ticket._id = ticket._id.toString();

    for(let x of ticket.comments){
        x._id = x._id.toString();
    }

    return ticket;

}

async function getAll() {

    if(arguments.length > 0) throw 'There should not be variables provided';
  
    TicketsCollection = await tickets();
  
    let ticketlist = await TicketsCollection.find({}).toArray();
  
    for(let x of ticketlist){
      x._id = x._id.toString();
      
      for(let y of x.comments){
          y._id = y._id.toString();
        }
    }
  
    return ticketlist;
  
  }

async function update(id, title, description, priority, project, status, errorType) {

    let parsedId = toObjectId(id, 'ticketId');

    await areAppropriateParameters(title, description, priority, project, errorType);

    priority = Number(priority);

    isValidStatus(status);

    TicketsCollection = await tickets();

    await get(id);

    let updateTicket = {
        title: title,
        description: description,
        priority: priority,
        project: project,
        status: status,
        errorType: errorType,
    };

    const updatedInfo = await TicketsCollection.updateOne(
        { _id: parsedId },
        { $set: updateTicket }
    );

    if (updatedInfo.modifiedCount === 0) {
        throw 'could not update ticket successfully';
    }

    return await get(id);

}

async function addAssignedUser(ticketId, userId) {

    let parsedticketId = toObjectId(ticketId, 'ticketId');

    let parseduserId = toObjectId(userId, 'userId');

    TicketsCollection = await tickets();

    await get(ticketId);

    const user = await userData.get(userId);

    let userinfo = {
        _id: userId,
        username: user.username
    }

    const updatedInfo = await TicketsCollection.updateOne({ _id: parsedticketId }, { $addToSet: { assignedUsers: userinfo } });

    if (updatedInfo.modifiedCount === 0) {
        throw 'could not add assigned user successfully';
    }

    return await get(ticketId);

}

async function removeAssignedUser(ticketId, userId) {

    let parsedticketId = toObjectId(ticketId, 'ticketId');

    let parseduserId = toObjectId(userId, 'userId');

    TicketsCollection = await tickets();

    await get(ticketId);

    const user = await userData.get(userId);

    const updatedInfo = await TicketsCollection.updateOne({ _id: parsedticketId }, { $pull: { assignedUsers: { _id: userId }} });

    if (updatedInfo.modifiedCount === 0) {
        throw 'could not add assigned user successfully';
    }

    return await get(ticketId);

}

async function remove(id) {

    let parsedId = toObjectId(id, 'ticketId');

    TicketsCollection = await tickets();

    let ticket = await get(id);

    const deletionInfo = await TicketsCollection.deleteOne({ _id: parsedId });
    
    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete ticket with id of ${id}`;
    }

    let deleteresult = {deleted: true};
    
    return deleteresult;

}
  

async function updateStatus(id, status) {

    let parsedId = toObjectId(id, 'ticketId');

    isValidStatus(status);

    TicketsCollection = await tickets();

    await get(id);

    let newstatus = {
        status: status,
    };

    const updatedInfo = await TicketsCollection.updateOne(
        { _id: parsedId },
        { $set: newstatus }
    );

    if (updatedInfo.modifiedCount === 0) {
        throw 'could not update ticket status successfully';
    }

    return {updated: true};

}

async function getTicketsByUser(userId, type) {

    if(type !== 'assigned' && type !== 'creator') throw 'Provided user type not valid';

    let parsedId = toObjectId(userId, 'userId');

    TicketsCollection = await tickets();

    let ticketlist = [];

    if(type === 'assigned'){

        ticketlist = await TicketsCollection.find({assignedUsers: userId}).toArray();
        
    }else{

        ticketlist = await TicketsCollection.find({creator: userId}).toArray();

    }

    for(let x of ticketlist){
        x._id = x._id.toString();
        
        for(let y of x.comments){
            y._id = y._id.toString();
        }
    }
  
    return ticketlist;
}

async function getTicketsByProject(projectId) {
    
    let parsedId = toObjectId(projectId, 'projectId');

    projectsCollection = await projects();
    
    let project = await projectsCollection.findOne({ _id: project });
    if (project === null) {
        throw new Error(`No Project found for id ${id}`);
    }

    TicketsCollection = await tickets();
  
    let ticketlist = await TicketsCollection.find({project: projectId}).toArray();
  
    for(let x of ticketlist){
        x._id = x._id.toString();
        
        for(let y of x.comments){
            y._id = y._id.toString();
        }
    }
  
    return ticketlist;
}

async function search(phrase) {

    isAppropriateString(phrase, 'phrase');

    TicketsCollection = await tickets();

    phrase = phrase.toLowerCase();
  
    let ticketlist = await TicketsCollection.find({
        $or: [
          { title: { $regex: ".*" + phrase + ".*", $options: "i" } },
          { description: { $regex: ".*" + phrase + ".*", $options: "i" } },
          { errorType: { $regex: ".*" + phrase + ".*", $options: "i" }},
        ],
      })
      .toArray();
  
    for(let x of ticketlist){
        x._id = x._id.toString();
        
        for(let y of x.comments){
            y._id = y._id.toString();
        }
    }
  
    return ticketlist;
    
}

async function searchTicketsByErrorType(phrase) {

    isAppropriateString(phrase, 'error type phrase');

    TicketsCollection = await tickets();

    phrase = phrase.toLowerCase();
  
    let ticketlist = await TicketsCollection.find({
        $where: "this.errorType.toLowerCase().indexOf('" + phrase + "') >= 0"
      })
      .toArray();
  
    for(let x of ticketlist){
        x._id = x._id.toString();
        
        for(let y of x.comments){
            y._id = y._id.toString();
        }
    }
  
    return ticketlist;
    
}

async function SortByPriority() {
    
    TicketsCollection = await tickets();
  
    let ticketlist = await TicketsCollection.find({}).sort({priority: -1}).toArray();
  
    for(let x of ticketlist){
        x._id = x._id.toString();
        
        for(let y of x.comments){
            y._id = y._id.toString();
        }
    }
  
    return ticketlist;
}

async function getTicketsByStatus(status) {

    isValidStatus(status);

    TicketsCollection = await tickets();
  
    let ticketlist = await TicketsCollection.find({status: status}).toArray();
  
    for(let x of ticketlist){
        x._id = x._id.toString();
        
        for(let y of x.comments){
            y._id = y._id.toString();
        }
    }
  
    return ticketlist;
}

async function getTicketsByPriority(priority) {
    
    if(isNaN(Number(priority))) throw 'Provided priority should not be NaN';
    else if(Number(priority) !== 1 && Number(priority) !== 2 && Number(priority) !== 3) throw 'Provided priority not valid';

    TicketsCollection = await tickets();
  
    let ticketlist = await TicketsCollection.find({priority: priority}).toArray();
  
    for(let x of ticketlist){
        x._id = x._id.toString();
        
        for(let y of x.comments){
            y._id = y._id.toString();
        }
    }
  
    return ticketlist;

}

async function addHistory(id, history) {

    if(Object.prototype.toString.call(history) !== '[object Object]'){
        throw 'provided history is not a object';
    }

    if(!history.Property || !history.Value){
        throw 'provided history lack of necessary keys';
    }

    let parsedId = toObjectId(id, 'ticketId');

    let modifiedTime = Date.now();

    TicketsCollection = await tickets();

    await get(id);

    let newHistory = {
        history: history,
        modifiedTime: modifiedTime,
    };

    const updatedInfo = await TicketsCollection.updateOne(
        { _id: parsedId },
        { $addToSet: {history: newHistory } }
    );

    if (updatedInfo.modifiedCount === 0) {
        throw 'could not update ticket status successfully';
    }

    return await get(id);

}

module.exports = {
    areAppropriateParameters,
    isAppropriateString,
    toObjectId,
    create,
    get,
    getAll,
    update,
    addAssignedUser,
    removeAssignedUser,
    remove,
    updateStatus,
    getTicketsByUser,
    getTicketsByPriority,
    getTicketsByProject,
    getTicketsByStatus,
    SortByPriority,
    search,
    searchTicketsByErrorType,
    addHistory    
}
