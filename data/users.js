const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
let { ObjectId } = require('mongodb');


//Sign up 

const signup = async function signup () {
    
    let newUser = {
        username: username,
        hashedPassword: hashedPassword,
        role: role,
        assignedProjects: [],
        createdTickets : [],
        assignedTickets: [],
    };

    let usersCollection = await users();

    const insertInfo = await usersCollection.insertOne(newUser);
    if (insertInfo.insertedCount === 0) throw 'Could not User';

    let newId = insertInfo.insertedId.toString();

    return await get(newId);
}

const signin = async function signin () {
    
    
}

module.exports= {
    signup,
    
}