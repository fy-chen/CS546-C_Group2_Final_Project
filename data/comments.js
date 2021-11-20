const mongoCollections = require('../config/mongoCollections');
const tickets = mongoCollections.tickets;
const ticketsData = require('./tickets');


async function create(ticketId, text, userId) {

    ticketsData.isAppropriateString(text, 'text');

    let parseduserId = ticketsData.toObjectId(userId, 'userId');
    let parsedticketId = ticketsData.toObjectId(ticketId, 'ticketId');
    
    let createdTime = Date.now();

    TicketsCollection = await tickets();

    let ticket = await ticketsData.get(ticketId);

    let commentId = new ObjectId();

    let newComment = {
        _id: commentId,
        text: text,
        userId: userId,
        createdTime, createdTime
    };

    const updatedInfo = await TicketsCollection.updateOne({ _id: parsedticketId }, { $addToSet: { comments: newComment } });

    if (updatedInfo.modifiedCount === 0) {
        throw 'could not add comment successfully';
    }

    ticket = await ticketsData.get(ticketId);

    ticket._id = ticket._id.toString();

    for(let x of ticket.comments){
        x._id = x._id.toString();
    }

    return ticket;


}

async function getAll(ticketId) {

    ticketsData.toObjectId(ticketId, 'ticketId');
  
    let ticket = await ticketsData.get(ticketId);
  
    for(let x of ticket.comments){
      x._id = x._id.toString();
    }
  
    return ticket.reviews;
  
}

async function get(commentId){

    let parsedId = ticketsData.toObjectId(commentId);

    TicketsCollection = await tickets();

    let ticket = await TicketsCollection.findOne({ 'comments._id': parsedId});

    if (ticket === null) throw 'No comment with that id';

    for(let x of ticket.comments){
        if(x._id.toString() === reviewId){
            x._id = x._id.toString();
            return x;
        }
    }

}

async function remove(commentId) {

    let parsedId = ticketsData.toObjectId(commentId);

    TicketsCollection = await tickets();

    let ticket = await TicketsCollection.findOne({ 'comments._id': parsedId});

    if (ticket === null) throw 'No comment with that id';

    const updatedInfo = await TicketsCollection.updateOne({ _id: ticket._id }, { $pull: { comments: { _id: parsedId } } });

    if (updatedInfo.modifiedCount === 0) {
        throw 'could not remove comment successfully';
    }

    let resultobj = {"commentId": commentId, "deleted": true};

    return resultobj;

}