const mongoCollections = require('../config/mongoCollections');
const tickets = mongoCollections.tickets;
let { ObjectId } = require('mongodb');


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

async function create(title, description, priority, creator, project, createdTime, errorType) {

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
        comments: []
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

    return ticket;

}

async function update(id, title, description, priority, creator, project, status, errorType) {

    let parsedId = toObjectId(id, 'ticketId');

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
