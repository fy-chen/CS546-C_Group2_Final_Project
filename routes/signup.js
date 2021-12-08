const express = require('express');
const router = express.Router();    
const users = require('../data').users;
// const mongoCollections = require('../config/mongoCollections');
// const userCollection = mongoCollections.users;
const xss = require('xss');

router.post('/',async(req,res) =>{
    //assigning credentials to variables
    let username = xss(req.body.username);
    let password = xss(req.body.password);
    
    if (typeof username != 'string' || /[^A-Z0-9]/ig.test(username)){
        res.status(400).json({msg: "Username is not a valid string."});
        return;
    }
    
    if (username.length < 4){
        res.status(400).json({msg: "Username should be atleast 4 characters long"});
        return;
    }
    
    if (typeof password != 'string'){
        res.status(400).json({msg: "Password is not a valid string."});
        return;
    }

    if (password.length < 6){
        res.status(400).json({msg: "Password should be atleast 6 characters long"});
        return;
    }
    
    const strArr = password.split('');
    for (let i = 0; i<=password.length-1; i++){
        if (strArr[i]==' '){
            res.status(400).json({msg: "Password should not contain spaces"});
            return;
        }
    }
    username = username.toLowerCase();
    try{
        const userCreated =  await users.signup(req.body);
        res.status(200).json({msg: userCreated});
    }
    catch(e){
        if (e.status){
            res.status(e.status).json(e)
        }
    }
    
    
    
    
    
    
});


module.exports = router;