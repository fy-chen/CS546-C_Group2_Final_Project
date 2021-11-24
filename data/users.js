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
    console.log(body);
    const salt = crypto.randomBytes(16).toString('hex'); 
    const hash = crypto.pbkdf2Sync(body.password, salt,  
    1000, 64, `sha512`).toString(`hex`);
    if (body.adminAccess){
        const superAccess = await usersCollection.findOne({ "username":  body.username });
    }
    let newUser = {
        username: body.username,
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
    // return await get(newId);
}

const validPassword = async function(password,userProfile) { 
    var hash = crypto.pbkdf2Sync(password,  
    userProfile.salt, 1000, 64, `sha512`).toString(`hex`); 
    return userProfile.hashedPassword === hash; 
}; 

const signin = async function signin (body) {
    let usersCollection = await users();
    const userProfile = await usersCollection.findOne({ "username":  body.username });
    console.log(userProfile);
    if(userProfile == null){
        return "User Not Found"
    }
    else if (await validPassword(body.password,userProfile)){
        const expiresIn = 10 * 60 * 60;
        const accessToken = jwt.sign({ id: body.username , role: userProfile.role, uid: userProfile._id,secret: body.password }, SECRET_KEY, {
            expiresIn: expiresIn
        });
        return "Logged In Successfully. Heres the JWT: " + accessToken;
    }
    else{
        return "Invalid Password"
    }
}

module.exports= {
    signup,
    signin
    
}