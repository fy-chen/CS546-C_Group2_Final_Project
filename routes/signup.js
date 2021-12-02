const express = require('express');
const router = express.Router();    
const users = require('../data').users;
// const mongoCollections = require('../config/mongoCollections');
// const userCollection = mongoCollections.users;


router.post('/',async(req,res) =>{
    //assigning credentials to variables
    let username = req.body.username;
    let password = req.body.password;
    
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

    const userCreated =  await users.signup(req.body);
    res.status(200).json(userCreated);
    
    
    
    
    
});


module.exports = router;