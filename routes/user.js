const express = require('express');
const router = express.Router();    
const users = require('../data').users;
// const mongoCollections = require('../config/mongoCollections');
// const userCollection = mongoCollections.users;
var mongodb = require('mongodb');


router.post('/assignTicket',async(req,res) =>{
    //Has to be admin
    // if (req.session.user.role != 1){
    //     res.status(401).json({"err": "Unauthorized!"})
    // }
    let ticketId = req.body.ticketId;
    let userId = req.body.userId;
    console.log(req.body)

    //Validations
    if (!mongodb.ObjectId.isValid(userId)){
        res.status(400).json({message:"userId is not a valid ObjectId"});
    }
    if (!mongodb.ObjectId.isValid(ticketId)){
        res.status(400).json({message:"ticketId is not a valid ObjectId"});
    }
    try{
        const userUpdated =  await users.addTicket(req.body);
        res.status(200).json(userUpdated);
    }
    catch(e){
        console.log(e)
        res.status(500).json({error: e})
    }
    
    
    
    
    
});

router.post('/removeTicket',async(req,res) =>{
    //Has to be admin
    // if (req.session.user.role != 1){
    //     res.status(401).json({"err": "Unauthorized!"})
    // }

    let ticketId = req.body.ticketId;
    let userId = req.body.userId;

    //Validations
    if (!mongodb.ObjectId.isValid(userId)){
        res.status(400).json({message:"userId is not a valid ObjectId"});
    }
    if (!mongodb.ObjectId.isValid(ticketId)){
        res.status(400).json({message:"ticketId is not a valid ObjectId"});
    }
    
    try{
        const userUpdated =  await users.removeTicket(req.body);
        res.status(200).json(userUpdated);
    }
    catch(e){
        console.log(e)
        res.status(500).json({error: e})
    }
   
    
    
    
    
    
});

router.post('/removeTicket',async(req,res) =>{
    //Has to be admin
    // if (req.session.user.role != 1){
    //     res.status(401).json({"err": "Unauthorized!"})
    // }

    let ticketId = req.body.ticketId;
    let userId = req.body.userId;

    //Validations
    if (!mongodb.ObjectId.isValid(userId)){
        res.status(400).json({message:"userId is not a valid ObjectId"});
    }
    if (!mongodb.ObjectId.isValid(ticketId)){
        res.status(400).json({message:"ticketId is not a valid ObjectId"});
    }
    
    try{
        const userUpdated =  await users.removeTicket(req.body);
        res.status(200).json(userUpdated);
    }
    catch(e){
        console.log(e)
        res.status(500).json({error: e})
    }
   
    
    
    
    
    
});




module.exports = router;