const mongoCollections = require('../config/mongoCollections');
const tickets = mongoCollections.tickets;
let { ObjectId } = require('mongodb');
let projectsData = require('./projects');


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
 
async function areAppropriateParameters (title, description, priority, creator, project, errorType) {

    isAppropriateString(title, 'title');
    isAppropriateString(description, 'description');
    isAppropriateString(creator, 'creator');
    isAppropriateString(project, 'project');
    isAppropriateString(errorType, 'errorType');

    if(isNaN(Number(priority))) throw 'Provided priority should not be NaN';
    else if(Number(priority) !== 1 || Number(priority) !== 2 || Number(priority) !== 3) throw 'Provided priority not valid';

    //should check if creator exist
    //should check if project exist
    // await projectsData.get(project);

}

let isValidcreatedTime = (createdTime) => {

    isAppropriateString(createdTime, 'createdTime');

    let now = Date.now();

    if(createdTime !== now) throw 'Provided createdTime is not today';

}

let isValidStatus = (status) => {

    isAppropriateString(status, 'status');

    //maybe more status

    if(status !== 'open' || status !== 'closed' || status !== 'ready_to_close') throw 'Provided status not valid';

}

async function create(title, description, priority, creator, project, errorType) {

    await areAppropriateParameters(title, description, priority, creator, project, errorType);

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

async function update(id, title, description, priority, creator, project, status, errorType) {

    let parsedId = toObjectId(id, 'ticketId');

    await areAppropriateParameters(title, description, priority, creator, project, errorType);

    isValidStatus(status);

    TicketsCollection = await tickets();

    await get(id);

    let updateTicket = {
        title: title,
        description: description,
        priority: priority,
        creator: creator,
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

    //should check if user exist

    const updatedInfo = await TicketsCollection.updateOne({ _id: parsedticketId }, { $addToSet: { assignedUsers: parseduserId } });

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

    let deleteresult = `${ticket.title} has been successfully deleted!`;
    
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

    return await get(id);

}

async function getTicketsByUser(userId, type) {

    if(type !== 'assigned' || type !== 'creator') throw 'Provided user type not valid';

    let parsedId = toObjectId(userId, 'userId');

    TicketsCollection = await tickets();

    if(type === 'assigned'){

        let ticketlist = await TicketsCollection.find({assignedUsers: parsedId}).toArray();
        
    }else{

        let ticketlist = await TicketsCollection.find({creator: parsedId}).toArray();

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

    TicketsCollection = await tickets();
  
    let ticketlist = await TicketsCollection.find({project: parsedId}).toArray();
  
    for(let x of ticketlist){
        x._id = x._id.toString();
        
        for(let y of x.comments){
            y._id = y._id.toString();
        }
    }
  
    return ticketlist;
}

async function searchTicketsByTitle(phrase) {

    isAppropriateString(phrase, 'title phrase');

    TicketsCollection = await tickets();
  
    let ticketlist = await TicketsCollection.find({ $text: { $search: phrase, $caseSensitive: false }}).toArray();
  
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
  
    let ticketlist = await TicketsCollection.find({}).sort({priority: 1}).toArray();
  
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
    else if(Number(priority) !== 1 || Number(priority) !== 2 || Number(priority) !== 3) throw 'Provided priority not valid';

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
    remove,
    updateStatus,
    getTicketsByUser,
    getTicketsByPriority,
    getTicketsByProject,
    getTicketsByStatus,
    SortByPriority,
    searchTicketsByTitle,
    addHistory    
}
