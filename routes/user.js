const express = require('express');
const router = express.Router();    
const users = require('../data').users;
const tickets = require('../data').tickets;
// const mongoCollections = require('../config/mongoCollections');
// const userCollection = mongoCollections.users;
var mongodb = require('mongodb');
const xss = require('xss');

router.post('/assignTicket',async(req,res) =>{
    //Has to be admin
    // if (req.session.user.role != 1){
    //     res.status(401).json({"err": "Unauthorized!"})
    // }
    let ticketId = xss(req.body.ticketId);
    let userId = xss(req.body.userId);
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
        await tickets.addAssignedUser(ticketId, userId);
        let history = {Property: 'AssigntoUser', Value: userUpdated.username};
        await tickets.addHistory(ticketId, history);
        res.status(200).json(userUpdated);
    }
    catch(e){
        console.log(e)
        res.status(500).json({error: e})
    }
    
});

router.get("/", async (req, res) => {
    try {
      const userList = await users.getAll();
      res.status(200).json(userList);
    } catch (e) {
      res.status(404).json({ error: e });
    }
});

router.get("/:id", async (req, res) => {
    try {
      const user = await users.get(xss(req.params.id));
      res.status(200).json(user);
    } catch (e) {
      res.status(404).json({ error: e });
    }
});

router.get("/getTickets", async (req, res) => {

    
    try {
      const tickets = await users.getAssignedTickets(req.session.user.userId);
      res.status(200).json(tickets);
    } catch (e) {
      res.status(404).json({ error: e });
    }
});

router.post('/removeTicket',async(req,res) =>{
    //Has to be admin
    // if (req.session.user.role != 1){
    //     res.status(401).json({"err": "Unauthorized!"})
    // }

    let ticketId = xss(req.body.ticketId);
    let userId = xss(req.body.userId);

    //Validations
    if (!mongodb.ObjectId.isValid(userId)){
        res.status(400).json({message:"userId is not a valid ObjectId"});
    }
    if (!mongodb.ObjectId.isValid(ticketId)){
        res.status(400).json({message:"ticketId is not a valid ObjectId"});
    }
    
    try{
        const userUpdated =  await users.removeTicket(xss(req.body));
        await tickets.removeAssignedUser(xss(req.body.ticketId), xss(req.body.userId));
        let history = {Property: 'RemoveAssignedUser', Value: userUpdated.username};
        await tickets.addHistory(xss(req.body.ticketId), history);
        res.status(200).json(userUpdated);
    }
    catch(e){
        console.log(e)
        res.status(500).json({error: e})
    }
   
    
    
    
    
    
});

/*
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
   
    
    
    
    
    
});*/




module.exports = router;