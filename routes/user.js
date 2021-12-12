const express = require('express');
const router = express.Router();
const users = require('../data').users;
const tickets = require('../data').tickets;
const projects = require('../data').projects;
let { ObjectId } = require('mongodb');
// const mongoCollections = require('../config/mongoCollections');
// const userCollection = mongoCollections.users;
var mongodb = require('mongodb');
const xss = require('xss');

router.post('/assignTicket', async (req, res) => {
    //Has to be admin
    if (req.session.user.role != 1){
        res.status(401).json({"err": "Unauthorized!"})
    }
    let ticketId = xss(req.body.ticketId);
    let userId = xss(req.body.userId);
    console.log(req.body)

    //Validations
    if (!mongodb.ObjectId.isValid(userId)){
        res.status(400).json({message:"userId is not a valid ObjectId"});
        return;
    }
    if (!mongodb.ObjectId.isValid(ticketId)){
        res.status(400).json({message:"ticketId is not a valid ObjectId"});
        return;
    }
    try {
        const userUpdated = await users.addTicket(req.body);
        const user = await users.get(userId);
        console.log(user);
        const ticket = await tickets.get(ticketId);
        console.log(ticket);
        if(user.assignedProjects.indexOf(ObjectId(ticket.project)) === -1){
            await users.addProject(userId, ticket.project);
        }
        await tickets.addAssignedUser(ticketId, userId);
        let history = { Property: 'AssigntoUser', Value: userUpdated.username };
        await tickets.addHistory(ticketId, history);
        res.status(200).json(userUpdated);
    }
    catch (e) {
        console.log(e)
        res.status(500).json({ error: e })
    }

});

router.get("/", async (req, res) => {
    //requires admin
    if (!req.session.user || req.session.user.userRole !== 1) {
        res.status(401).json({ message: "Unauthorized request" });
        return;
    }
    try {
        const userList = await users.getAll();
        res.status(200).json(userList);
    } catch (e) {
        res.status(404).json({ error: e });
    }
});

router.get("/admin/get", async (req, res) => {
    if (!req.session.user || req.session.user.userRole !== 1) {
        res.status(401).json({ message: "Unauthorized request" });
        return;
    }
    try {
        const admin = await users.get(req.session.user.userId);
        res.status(200).json(admin);
    } catch (e) {
        res.status(404).json({ error: e });
    }
});

router.get("/dev/get", async (req, res) => {
    //requires user
    if (!req.session.user) {
        res.status(401).json({ message: "Unauthorized request" });
        return;
    }
    try {
        const user = await users.get(req.session.user.userId);
        res.status(200).json(user);
    } catch (e) {
        res.status(404).json({ error: e });
    }
});

router.get("/:id", async (req, res) => {
    //requires user
    if (!req.session.user || req.session.user.userRole !== 1) {
        res.status(401).json({ message: "Unauthorized request" });
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
    //requires user
    if (!req.session.user) {
        res.status(401).json({ message: "Unauthorized request" });
        return;
    }

    try {
      const user = await users.get(req.session.user.userId);
      let ticketlist = {};
      let assignedTickets = [];
      let createdTickets = [];
      console.log(user);
      for(let x of user.assignedTickets) {
          let ticket = await tickets.get(x._id.toString());
          let creator = await users.get(ticket.creator);
          ticket.creator = creator.username;
          let project = await projects.get(ticket.project);
          ticket.project = project.projectName;
          assignedTickets.push(ticket);
      }

      for(let x of user.createdTickets) {
        let ticket = await tickets.get(x._id.toString());
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

router.post('/removeTicket', async (req, res) => {
    //Has to be admin
    if (req.session.user.role != 1){
        res.status(401).json({"err": "Unauthorized!"})
    }

    let ticketId = xss(req.body.ticketId);
    let userId = xss(req.body.userId);

    //Validations
    if (!mongodb.ObjectId.isValid(userId)) {
        res.status(400).json({ message: "userId is not a valid ObjectId" });
        return;
    }
    if (!mongodb.ObjectId.isValid(ticketId)) {
        res.status(400).json({ message: "ticketId is not a valid ObjectId" });
        return;
    }

    try {
        const userUpdated = await users.removeTicket(xss(req.body));
        await tickets.removeAssignedUser(xss(req.body.ticketId), xss(req.body.userId));
        let history = { Property: 'RemoveAssignedUser', Value: userUpdated.username };
        await tickets.addHistory(xss(req.body.ticketId), history);
        res.status(200).json(userUpdated);
    }
    catch (e) {
        console.log(e)
        res.status(500).json({ error: e })
    }






});

router.delete("/:id", async (req, res) => {
    //requires admin
    if (!req.session.user || req.session.user.userRole !== 1) {
        res.status(401).json({ message: "Unauthorized request" });
        return;
    }
    
    let userId = req.params.id;
    console.log(userId);
    if (!req.session.user || req.session.user.userRole !== 1) {
        res.status(401).json({ message: "Unauthorized request" });
        return;
    }
    if (!mongodb.ObjectId.isValid(userId)) {
        res.status(400).json({ message: "userId is not a valid ObjectId" });
        return;
    }
    try {
        console.log("got into try")
        const info = await users.remove(userId);
        res.status(200).json(info);
    } catch (e) {
        console.log(e)
        if (e.status) {
            res.status(e.status).json(e)
        }
        else {
            res.status(500).json({ message: "Something went wrong" })
        }
    }
});

router.put("/changePassword", async (req, res) => {
    // console.log("route test");
    // console.log(req.session.user.userId)    
    const userData = req.body;
    // console.log('userData');
    // console.log(userData);
    if (!req.session.user) {
        res.status(401).json({ message: "Unauthorized request" });
        return;
    }

    if (!mongodb.ObjectId.isValid(req.session.user.userId)) {
        res.status(400).json({ message: "userId is not a valid ObjectId" });
        return;
    }
    if(!userData){
        res.status(400).json({error: 'user missed'});
    }
    // if(!userData.username){
    //     res.status(400).json({error: 'username missed'});
    // }
    // if(!userData.o){
    //     res.status(400).json({error: 'username missed'});
    // }
    // if(!userData.username){
    //     res.status(400).json({error: 'username missed'});
    // }

    let oldPassword = userData.oldPassword;
    let newPassword = userData.newPassword;
    let user;
    let username;
    try {
        user = await users.get(req.session.user.userId);
    } catch (error) {
        res.status(404).json({error:'user not found'});
        return;  
    }
    username = user.username;
    // console.log("oldPassword:"+oldPassword);
    // console.log("newPassword"+newPassword);    
    // console.log("username:"+username);

    try {
        console.log('goto channgepassword()')
        const changePassword = await users.changePwd(username,oldPassword,newPassword);
        res.status(200).json({changed: true});
    } catch (error) {
        res.status(500).json({error: error});

    }

});
router.post('/assignProject',async(req,res) =>{
    //Has to be admin
    if (req.session.user.userRole != 1){
        res.status(401).json({"err": "Unauthorized!"})
    }
    let projectId = xss(req.body.projectId);
    let userId = xss(req.body.userId);

    //Validations
    if (!mongodb.ObjectId.isValid(userId)){
        res.status(400).json({message:"userId is not a valid ObjectId"});
        return;
    }
    if (!mongodb.ObjectId.isValid(projectId)){
        res.status(400).json({message:"projectId is not a valid ObjectId"});
        return;
    }
    try{
        const userUpdated =  await users.addProject(userId,projectId);
        await projects.addUser(projectId,userId);
        res.status(200).json(userUpdated);
    }
    catch(e){
        console.log(e)
        res.status(500).json({error: e})
    }
    
});

router.post('/unassignProject',async(req,res) =>{
    //Has to be admin
    if (req.session.user.userRole != 1){
        res.status(401).json({"err": "Unauthorized!"})
    }
    let projectId = xss(req.body.projectId);
    let userId = xss(req.body.userId);

    //Validations
    if (!mongodb.ObjectId.isValid(userId)){
        res.status(400).json({message:"userId is not a valid ObjectId"});
        return;
    }
    if (!mongodb.ObjectId.isValid(projectId)){
        res.status(400).json({message:"projectId is not a valid ObjectId"});
        return;
    }
    try{
        const userUpdated =  await users.removeProject(req.body);
        await projects.removeUser(projectId, userId);
        const projectDetail = await projects.get(projectId);
        for(let projectTicketId of projectDetail.tickets){ // projectDetail.tickets is array of  IDs of tickets
            await users.removeTicket({ticketId: projectTicketId, userId: userId})
        }
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