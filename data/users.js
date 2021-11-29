const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
let { ObjectId } = require('mongodb');
var crypto = require('crypto');
const jwt = require("jsonwebtoken");
const SECRET_KEY = "Wu-Tang is Forever";

//Sign up 
const adminPsGetter = async function adminPsGetter(userInput){
    
}

const signup = async function signup (body) {
    //assigning credentials to variables
    let username = body.username;
    let password = body.password;
    
    //Valdiations
    if (typeof username != 'string' || /[^A-Z0-9]/ig.test(username)){
        throw "Username is not a valid string."
    }
    if (username.length < 4){
        throw "Username should be atleast 4 characters long"
    }
    if (typeof password != 'string'){
        throw "Password is not a valid string."
    }
    if (password.length < 6){
        throw "Password should be atleast 6 characters long"
    }
    const strArr = password.split('');
    for (let i = 0; i<=password.length-1; i++){
        if (strArr[i]==' '){
            throw "Password should not contain spaces"
        }
    }
    username = username.toLowerCase();

    //Checking if user exists or not
    const userObj = await get(username);
    if (!("message" in userObj)){
        throw "Error: User already exists"
    }

    //Hashing password
    const salt = crypto.randomBytes(16).toString('hex'); 
    const hash = crypto.pbkdf2Sync(body.password, salt,  
    1000, 64, `sha512`).toString(`hex`);
    if (body.adminAccess){
        const superAccess = await usersCollection.findOne({ "username":  body.username });
    }
    
    //Storing user in DB
    let newUser = {
        username: username,
        hashedPassword: hash,
        salt: salt,
        role: 1,
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
const get = async function get(username){
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



const login = async function login (body) { 
    let usersCollection = await users();
    const userProfile = await usersCollection.findOne({ "username":  body.username });
    console.log(userProfile);
    if(userProfile == null){
        return {login : false, message:"Invalid Username or Password!"}
    }
    else if (await validPassword(body.password,userProfile)){
        // const expiresIn = 10 * 60 * 60;
        // const accessToken = jwt.sign({ id: body.username , role: userProfile.role, uid: userProfile._id,secret: body.password }, SECRET_KEY, {
        //     expiresIn: expiresIn
        // });
        return {login : true, message: "LoggedIn Successfully!", username: userProfile.username, userId : userProfile._id, userRole : userProfile.role};
    }
    else{
        return {login : false, message:"Invalid Username or Password!"}
    }
}

module.exports= {
    signup,
    login
    
}