const express = require('express');
const router = express.Router();    
const users = require('../data').users;
// const mongoCollections = require('../config/mongoCollections');
// const userCollection = mongoCollections.users;


router.post('/',async(req,res) =>{

    const userCreated =  await users.signup(req.body);
    res.status(200).render("pages/signupPage",{title:'Signup', userCreated: userCreated});
    
    
    
    
    
});


module.exports = router;