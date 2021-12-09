const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
var crypto = require('crypto');
// const jwt = require("jsonwebtoken");
// const SECRET_KEY = "Wu-Tang is Forever";
const admin = mongoCollections.admin; //admin password storage
const tickets = mongoCollections.tickets;
var mongodb = require('mongodb');
const projects = mongoCollections.projects;


//Sign up 
const adminPsGetter = async function adminPsGetter(userInput){
    let adminPassColl = await admin();
    let adminPass = await adminPassColl.findOne({name:'user0'});
    // console.log(adminPass)
    const result = await validPassword(userInput,adminPass);
    // console.log(result);
    if (await validPassword(userInput, adminPass)){
        return true;
    }
    else {
        return false;
    }
}

const adminPsSetter = async function adminPsSetter(userInput){
    const salt = crypto.randomBytes(16).toString('hex'); 
    const hash = crypto.pbkdf2Sync(userInput, salt,  
    1000, 64, `sha512`).toString(`hex`);
    let adminPassColl = await admin();
    let adminPass = await adminPassColl.updateOne({name:'user0'},{$set:{hashedPassword: hash, salt: salt}});
    if(adminPass.modifiedCount == 1){
        console.log("done")
        return "Password changed successfully!";
    }
    else{
        return "Error in changing password!";
    }
}

const signup = async function signup (body) {
    //assigning credentials to variables
    let username = body.username;
    let password = body.password;
    
    //Valdiations
    if (typeof username != 'string' || /[^A-Z0-9]/ig.test(username)){
        throw {status:400, msg:"Username is not a valid string."}
    }
    if (username.length < 4){
        throw  {status:400, msg: "Username should be atleast 4 characters long"}
    }
    if (typeof password != 'string'){
        throw  {status:400, msg:"Password is not a valid string."}
    }
    if (password.length < 6){
        throw  {status:400, msg:"Password should be atleast 6 characters long"}
    }
    const strArr = password.split('');
    for (let i = 0; i<=password.length-1; i++){
        if (strArr[i]==' '){
            throw  {status:400, msg:"Password should not contain spaces"}
        }
    }
    username = username.toLowerCase();

    //Checking if user exists or not
    const userObj = await getByUsername(username);
    if (!("message" in userObj)){
        throw  {status:400, msg:"Error: User already exists"}
    }

    //Hashing password
    const salt = crypto.randomBytes(16).toString('hex'); 
    const hash = crypto.pbkdf2Sync(body.password, salt,  
    1000, 64, `sha512`).toString(`hex`);

    let role = 2;
    console.log(body.adminAccess);
    if (body.adminAccess!=null){
        const result = await adminPsGetter(body.adminAccess);
        console.log(result);
        if ((await adminPsGetter(body.adminAccess))){
            role = 1;
        }
        else{
            throw  {status:401, msg:"Error: Admin password incorrect"};
        }
    }
    
    //Storing user in DB
    let newUser = {
        username: username,
        hashedPassword: hash,
        salt: salt,
        role: role,
        assignedProjects: [],
        createdTickets : [],
        assignedTickets: [],
    };

    let usersCollection = await users();

    const insertInfo = await usersCollection.insertOne(newUser);
    if (insertInfo.insertedCount === 0) throw 'Could not User';

    let newId = insertInfo.insertedId.toString();
    return body.username + " created!"
}

//Getter function for user
const getByUsername = async function getByUsername(username){
    const userCollection = await users();
    const userObj = await userCollection.findOne({ username: username });
    if (userObj != null){
        return userObj;
    }
    else{
        return {message: "No entry exists for the user: "+ username}; 
    }
}

//Hashing helper function
const validPassword = async function(password,userProfile) { 
    let hash = crypto.pbkdf2Sync(password,  
    userProfile.salt, 1000, 64, `sha512`).toString(`hex`); 
    return userProfile.hashedPassword === hash; 
}; 



const login = async function login (username,password) { 
    username = username.toLowerCase();
    let usersCollection = await users();
    const userProfile = await usersCollection.findOne({ "username":  username });
    console.log(userProfile);
    if(userProfile == null){
        return {login : false, message:"Invalid Username or Password!"}
    }
    else if (await validPassword(password,userProfile)){
        return {login : true, message: "LoggedIn Successfully!", username: userProfile.username, userId : userProfile._id, userRole : userProfile.role};
    }
    else{
        return {login : false, message:"Invalid Username or Password!"}
    }
}


const get = async function get(id){
    if(typeof id != 'string'){
        throw "Id is not a string"
    }
    if(!mongodb.ObjectId.isValid(id)){
        throw "Not a valid ObjectId";
    }
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: mongodb.ObjectId(id) });
    if (user != null){
        user._id = String(user._id);
        return user;
    }
    else{
        return null; 
    }
}

const getAll = async function getAll(){
    const userCollection = await users();
    const userlist = await userCollection.find({role:2}).toArray();
    if (userlist != null){
        const projCollection = await projects();
        const ticketCollection = await tickets();
        for(let user of userlist){
            delete user.hashedPassword;
            delete user.salt;
            for (let  [index, value] of user.assignedProjects.entries()){
                user.assignedProjects[index] = await projCollection.findOne({_id : value});
            }
            for (let  [index, value] of user.createdTickets.entries()){
                user.createdTickets[index] = await ticketCollection.findOne({_id : value});
            }
            for (let  [index, value] of user.assignedTickets.entries()){
                user.assignedTickets[index] = await ticketCollection.findOne({_id : value});
            }
            user._id = String(user._id);
        }
        return userlist;
    }
    else{
        return null; 
    }
}

const remove = async function remove(id){

    if(typeof id != 'string'){
        throw {status:400, message:"Id is not a string"};
    }
    if(!mongodb.ObjectId.isValid(id)){
        throw {status:400, message:"Not a valid ObjectId"};
    }
    const usersCollection = await users();
    const user = await usersCollection.findOne({ _id: mongodb.ObjectId(id) });
    if(user == null){
        throw {status:204, message:"No entry exists for the ID:" +id};
    }
    const deletionInfo = await usersCollection.deleteOne({ _id: mongodb.ObjectId(id)  });
    if (deletionInfo.deletedCount === 0) {
        throw {status:500, message:`Could not delete user with id of ${id}` };
    }
    return {'userId' : id, 'deleted': true };
}


const addTicket = async function addTicket (body){

    let ticketId = body.ticketId;
    let userId = body.userId;
    if (!mongodb.ObjectId.isValid(userId)){
        throw "userId is not a valid ObjectId";
    }
    if (!mongodb.ObjectId.isValid(ticketId)){
        throw "ticketId is not a valid ObjectId";
    }
    //find if user exists
    let usersCollection = await users();
    const userProfile = await usersCollection.findOne({ _id:  mongodb.ObjectId(userId)});
    if(userProfile == null){
        throw "User does not exist"
    }
 
    //find if ticket exists
    let ticketsCollection = await tickets();
    const ticketProfile = await ticketsCollection.findOne({ _id:  mongodb.ObjectId(ticketId)});
    if(ticketProfile == null){
        throw "User does not exist"
    }

   
    const updatedInfo = await usersCollection.updateOne({_id: mongodb.ObjectId(userId)},{$addToSet: { assignedTickets: mongodb.ObjectId(ticketId) }});
    if (updatedInfo == null){
        throw "Could not add ticket to user"
    }
    return await get(String(userId));    

}

const removeTicket = async function removeTicket (body){

    let ticketId = body.ticketId;
    let userId = body.userId;
    if (!mongodb.ObjectId.isValid(userId)){
        throw "userId is not a valid ObjectId";
    }
    if (!mongodb.ObjectId.isValid(ticketId)){
        throw "ticketId is not a valid ObjectId";
    }
    //find if user exists
    let usersCollection = await users();
    const userProfile = await usersCollection.findOne({ _id:  mongodb.ObjectId(userId)});
    
    if(userProfile == null){
        throw "User does not exist"
    }

    const updatedInfo = await usersCollection.updateOne({_id: mongodb.ObjectId(userId)},{$pull: { assignedTickets: mongodb.ObjectId(ticketId) }});
    if (updatedInfo == null){
        throw "Could not remove ticket to user"
    }
    return await get(String(userId));
    
}

const addcreatedTicket = async function addcreatedTicket (userId, ticketId){

    if (!mongodb.ObjectId.isValid(userId)){
        throw "userId is not a valid ObjectId";
    }
    if (!mongodb.ObjectId.isValid(ticketId)){
        throw "ticketId is not a valid ObjectId";
    }
    //find if user exists
    let usersCollection = await users();
    const userProfile = await usersCollection.findOne({ _id:  mongodb.ObjectId(userId)});
    if(userProfile == null){
        throw "User does not exist"
    }
 
    //find if ticket exists
    let ticketsCollection = await tickets();
    const ticketProfile = await ticketsCollection.findOne({ _id:  mongodb.ObjectId(ticketId)});
    if(ticketProfile == null){
        throw "User does not exist"
    }

   
    const updatedInfo = await usersCollection.updateOne({_id: mongodb.ObjectId(userId)},{$addToSet: { createdTickets: mongodb.ObjectId(ticketId) }});
    if (updatedInfo == null){
        throw "Could not add ticket to user"
    }
    return await get(String(userId));    

}

const removecreatedTicket = async function removecreatedTicket (body){

    let ticketId = body.ticketId;
    let userId = body.userId;
    if (!mongodb.ObjectId.isValid(userId)){
        throw "userId is not a valid ObjectId";
    }
    if (!mongodb.ObjectId.isValid(ticketId)){
        throw "ticketId is not a valid ObjectId";
    }
    //find if user exists
    let usersCollection = await users();
    const userProfile = await usersCollection.findOne({ _id:  mongodb.ObjectId(userId)});
    
    if(userProfile == null){
        throw "User does not exist"
    }

    const updatedInfo = await usersCollection.updateOne({_id: mongodb.ObjectId(userId)},{$pull: { createdTickets: mongodb.ObjectId(ticketId) }});
    if (updatedInfo == null){
        throw "Could not remove ticket to user"
    }
    return await get(String(userId));
    
}

// const addProject = async function addProject (body){

//     let projectId = body.projectId;
//     let userId = body.userId;
//     if (!mongodb.ObjectId.isValid(userId)){
//         throw "userId is not a valid ObjectId";
//     }
//     if (!mongodb.ObjectId.isValid(projectId)){
//         throw "ticketId is not a valid ObjectId";
//     }
//     //find if user exists
//     let usersCollection = await users();
//     const userProfile = await usersCollection.findOne({ _id:  mongodb.ObjectId(userId)});
//     if(userProfile == null){
//         throw "User does not exist"
//     }
 
//     //find if ticket exists
//     let projectId = await tickets();
//     const ticketProfile = await ticketsCollection.findOne({ _id:  mongodb.ObjectId(ticketId)});
//     if(ticketProfile == null){
//         throw "User does not exist"
//     }

   
//     const updatedInfo = await usersCollection.updateOne({_id: mongodb.ObjectId(id)},{$addToSet: { assignedUsers: mongodb.ObjectId(ticketId) }});
//     if (updatedInfo == null){
//         throw "Could not add ticket to user"
//     }
//     return await get(String(id));    
// }

module.exports= {
    signup,
    login,
    get,
    getByUsername,
    adminPsSetter,
    addTicket,
    removeTicket,
    getAll,
    addcreatedTicket,
    removecreatedTicket,
    remove,
    
}


// adminPsSetter("bigboss@42069");