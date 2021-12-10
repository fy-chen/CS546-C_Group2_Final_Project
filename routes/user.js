const express = require('express');
const router = express.Router();    
const users = require('../data').users;
const tickets = require('../data').tickets;
const projects = require('../data').projects;
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
    if (!req.session.user  || req.session.user.userRole !== 1){
        res.status(401).json({message:"Unauthorized request"});
        return;
    }
    try {
      const userList = await users.getAll();
      res.status(200).json(userList);
    } catch (e) {
      res.status(404).json({ error: e });
    }
});

router.get("/:id", async (req, res) => {
    if (!req.session.user  || req.session.user.userRole !== 1){
        res.status(401).json({message:"Unauthorized request"});
        return;
    }
    try {
      const user = await users.get(xss(req.params.id));
      res.status(200).json(user);
    } catch (e) {
      res.status(404).json({ error: e });
    }
});

router.get("/tickets/get", async (req, res) => {

    
    try {
      const user = await users.get(req.session.user.userId);
      let ticketlist = {};
      let assignedTickets = [];
      let createdTickets = [];
      for(let x of user.assignedTickets) {
          let ticket = await tickets.get(x.toString());
          let creator = await users.get(ticket.creator);
          ticket.creator = creator.username;
          let project = await projects.get(ticket.project);
          ticket.project = project.projectName;
          assignedTickets.push(ticket);
      }

      for(let x of user.createdTickets) {
        let ticket = await tickets.get(x.toString());
        let creator = await users.get(ticket.creator);
        ticket.creator = creator.username;
        let project = await projects.get(ticket.project);
        ticket.project = project.projectName;
        createdTickets.push(ticket);
    }
    ticketlist.createdTicket = createdTickets;
    ticketlist.assignedTicket = assignedTickets;

    console.log(ticketlist);

      res.status(200).json(ticketlist);
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
        return;
    }
    if (!mongodb.ObjectId.isValid(ticketId)){
        res.status(400).json({message:"ticketId is not a valid ObjectId"});
        return;
    }
    
    try{
        const userUpdated =  await users.removeTicket(req.body);
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

router.delete("/:id", async (req, res) => {
    let userId = req.params.id;
    console.log(userId);
    if (!req.session.user  || req.session.user.userRole !== 1){
        res.status(401).json({message:"Unauthorized request"});
        return;
    }
    if (!mongodb.ObjectId.isValid(userId)){
        res.status(400).json({message:"userId is not a valid ObjectId"});
        return;
    } 
    try {
      console.log("got into try")
      const info = await users.remove(userId);
      res.status(200).json(info);
    } catch (e) {
        console.log(e)
        if (e.status){
            res.status(e.status).json(e)
        }
        else{ 
            res.status(500).json({message:"Something went wrong"})
        }
    }
});

/*
router.post('/removeTicket',async(req,res) =>{
    //Has to be admin
    // if (!req.session.user  || req.session.user.userRole !== 1){
    //     res.status(401).json({message:"Unauthorized request"});
    //     return;
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