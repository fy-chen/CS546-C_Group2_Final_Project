const express = require('express');
const router = express.Router();
const data = require('../data');
const ticketsData = data.tickets;
const projectsData = data.projects;
const userData = data.users;
const xss = require('xss');

router.get('/:id', async(req, res) => {

    try{
        const ticket = await ticketsData.get(req.params.id);
        res.json(ticket);
    }catch(e) {
        res.status(500).json({ error: e });
    }
});

router.get('/', async(req, res) => {
    try{
        const tickets = await ticketsData.getAll();
        for(let x of tickets){
            let user = await userData.get(x.creator);
            x.creator = user.username;
            let project = await projectsData.get(x.project);
            x.project = project.projectName;
        }
        console.log(tickets);
        res.json(tickets);
    }catch(e) {
        res.status(500).json({ error: e });
    }
});


router.get('/status/', async(req, res) => {

    let tickets = {};
    try{
        const openTickets = ticketsData.getTicketsByStatus("open");
        tickets.openTickets = openTickets;
        const ticketsReadytoClose = ticketsData.getTicketsByStatus("ready_to_close");
        tickets.ticketsReadytoClose = ticketsReadytoClose;
        const closedTickets = ticketsData.getTicketsByStatus("closed");
        tickets.closedTickets = closedTickets;
        res.json(tickets);
    }catch(e) {
        res.status(500).json({ error: e });
    }
});


router.get('/priority/get/', async(req, res) => {

    let tickets = {};
    try{
        const ticketsPriority1 = await ticketsData.getTicketsByPriority(1);
        for(let x of ticketsPriority1){
            let user = await userData.get(x.creator);
            x.creator = user.username;
            let project = await projectsData.get(x.project);
            x.project = project.projectName;
        }
        tickets.ticketsPriority1 = ticketsPriority1;
        
        const ticketsPriority2 = await ticketsData.getTicketsByPriority(2);
        for(let x of ticketsPriority2){
            let user = await userData.get(x.creator);
            x.creator = user.username;
            let project = await projectsData.get(x.project);
            x.project = project.projectName;
        }
        tickets.ticketsPriority2 = ticketsPriority2;
        
        const ticketsPriority3 = await ticketsData.getTicketsByPriority(3);
        for(let x of ticketsPriority3){
            let user = await userData.get(x.creator);
            x.creator = user.username;
            let project = await projectsData.get(x.project);
            x.project = project.projectName;
        }
        tickets.ticketsPriority3 = ticketsPriority3;
        console.log(tickets);
        res.json(tickets);
    }catch(e) {
        res.status(500).json({ error: e });
    }
});

router.post('/search', async(req, res) => {

    let cleanedPhrase = xss(req.body.phrase);
    try{
        if(!cleanedPhrase || cleanedPhrase.trim().length === 0) {
            throw 'Provided search phrase is empty';
        }
    }catch(e) {
        res.status(403).json({ error: e });
        return;
    }

    try{
        const ticketlist = await ticketsData.search(cleanedPhrase);
        if(ticketlist.length === 0){
            res.json({notFound: true});
        }else{
            res.json({tickets: ticketlist});
        }
    }catch(e) {
        res.status(500).json({ error: e });
    }
});

router.post('/create', async(req, res) => {

    const ticketData = req.body;

    console.log(ticketData);

    console.log(req.session.user.userId);

    let userId = req.session.user.userId;

    let errors = {};

    try{
        ticketsData.isAppropriateString(ticketData.title, 'title');
    }catch(e) {
        errors.title_error = e;
    }

    try{
        ticketsData.isAppropriateString(ticketData.description, 'description');
    }catch(e) {
        errors.description_error = e;
    }

    try{
        ticketsData.isAppropriateString(req.session.user.userId, 'creator');
    }catch(e) {
        errors.creator_error = e;
    }
        
    try{
        ticketsData.isAppropriateString(ticketData.project, 'project');
    }catch(e) {
        errors.project_error = e;
    }
        
    try{
        ticketsData.isAppropriateString(ticketData.errorType, 'errorType');
    }catch(e) {
        errors.errorType_error = e;
    }

    try{
        if(isNaN(Number(ticketData.priority))) throw 'Provided priority should not be NaN';
        else if(Number(ticketData.priority) !== 1 && Number(ticketData.priority) !== 2 && Number(ticketData.priority) !== 3) throw 'Provided priority not valid';
    }catch(e) {
        errors.priority_error = e;
    }

    if(ticketData.title.length < 4 || ticketData.title.length > 30) errors.title_length_error = 'Provided title should be at least 4 characters long and at most 30 characters long';

    if(ticketData.description.length < 4 || ticketData.description.length > 100) errors.description_length_error = 'Provided description should be at least 4 characters long and at most 100 characters long';

    if(ticketData.errorType.length < 4 || ticketData.errorType.length > 30) errors.errorType_length_errror =  'Provided errorType should be at least 4 characters long and at most 30 characters long';
        
    //should check if creator exist  
    try{
        await userData.get(userId);
    }catch(e) {
        errors.user_not_exist = e;
    }

    
    try{
        await projectsData.get(ticketData.project);
    }catch(e) {
        errors.project_not_exist = e;
    }

    if(Object.keys(errors).length !== 0){
        res.status(500).json({ticketData: ticketData, error: true, errors: errors});
        return;
    }
    
    try{
        const ticket = await ticketsData.create(ticketData.title, ticketData.description, ticketData.priority, userId, ticketData.project, ticketData.errorType);
        const project = await projectsData.addTickets(ticketData.project, ticket._id);
        const user = await userData.addcreatedTicket(req.session.user.userId, ticket._id);
        res.json(ticket);
    }catch(e) {
        res.status(500).json({ error: e });
    }
    
});

router.delete('/:id', async (req, res) => {

    //Has to be admin
    // if (req.session.user.role != 1){
    //     res.status(401).json({"err": "Unauthorized!"})
    // }

    try {
        const ticket = await ticketsData.get(req.params.id);
        let assignedUsers = ticket.assignedUsers;
        let creator = ticket.creator;
        let creatorbody = {userId: creator, ticketId: req.params.id};
        await userData.removecreatedTicket(creatorbody);
        for(let x of assignedUsers){
            let body = {userId: x._id, ticketId: req.params.id};
            await userData.removeTicket(body);
        }
        const DeleteInfo = await ticketsData.remove(req.params.id);
        res.status(200).json(DeleteInfo);
    }catch (e) {
        res.status(500).json({ error: e });
    }
});

router.put('/edit/:id', async(req, res) => {

    const modifiedData = req.body;

    console.log(modifiedData);

    let ticket = await ticketsData.get(req.params.id);

    let isAssignedUser = false;

    for(let x of ticket.assignedUsers){
        if(x._id === req.session.user.userId){
            isAssignedUser = true;
            break;
        }
    }

    if(ticket.creator !== req.session.user.userId && req.session.user.role !== 1 && !isAssignedUser) {
        res.status(500).json({ NotAuthorized: true });
    }

    let errors = {}

    try{
        ticketsData.isAppropriateString(modifiedData.title, 'title');
    }catch(e) {
        errors.title_error = e;
    }

    try{
        ticketsData.isAppropriateString(modifiedData.description, 'description');
    }catch(e) {
        errors.description_error = e;
    }
        
    try{
        ticketsData.isAppropriateString(modifiedData.project, 'project');
    }catch(e) {
        errors.project_error = e;
    }
        
    try{
        ticketsData.isAppropriateString(modifiedData.errorType, 'errorType');
    }catch(e) {
        errors.errorType_error = e;
    }

    try{
        if(isNaN(Number(modifiedData.priority))) throw 'Provided priority should not be NaN';
        else if(Number(modifiedData.priority) !== 1 && Number(modifiedData.priority) !== 2 && Number(modifiedData.priority) !== 3) throw 'Provided priority not valid';
    }catch(e) {
        errors.priority_error = e;
    }

    if(modifiedData.title.length < 4 || modifiedData.title.length > 30) errors.title_length_error = 'Provided title should be at least 4 characters long and at most 30 characters long';

    if(modifiedData.description.length < 4 || modifiedData.description.length > 100) errors.description_length_error = 'Provided description should be at least 4 characters long and at most 100 characters long';

    if(modifiedData.errorType.length < 4 || modifiedData.errorType.length > 30) errors.errorType_length_errror =  'Provided errorType should be at least 4 characters long and at most 30 characters long';
        
    
    try{
        await projectsData.get(modifiedData.project);
    }catch(e) {
        errors.project_not_exist = e;
    }

    try{
        ticketsData.isAppropriateString(modifiedData.status, 'status');
        if(modifiedData.status !== 'open' && modifiedData.status !== 'closed' && modifiedData.status !== 'ready_to_close') throw 'Provided status not valid';
    }catch(e) {
        errors.status_error = e;
    }

    if(Object.keys(errors).length !== 0){
        res.json({ticketData: modifiedData, error: true, errors: errors});
        return;
    }

    let history = {Property: 'Update', Value: ''};
    let history_value = '';

    try {
        const ticket = await ticketsData.get(req.params.id);

        console.log(ticket);

        if(ticket.title !== modifiedData.title){
            let modify_content = `title: ${modifiedData.title} \n`
            history_value = history_value.concat(modify_content);
        }

        if(ticket.description !== modifiedData.description){
            let modify_content = `description: ${modifiedData.description} \n`
            history_value = history_value.concat(modify_content);
        }

        if(ticket.project !== modifiedData.project){
            let project = await projectsData.get(modifiedData.project);
            let modify_content = `project: ${project.projectName} \n`
            history_value = history_value.concat(modify_content);
        }

        if(ticket.errorType !== modifiedData.errorType){
            let modify_content = `errorType: ${modifiedData.errorType} \n`
            history_value = history_value.concat(modify_content);
        }

        if(ticket.priority !== modifiedData.priority){
            let modify_content = `priority: ${modifiedData.priority} \n`
            history_value = history_value.concat(modify_content);
        }

        if(ticket.status !== modifiedData.status){
            let modify_content = `status: ${modifiedData.status} \n`
            history_value = history_value.concat(modify_content);
        }

        history.Value = history_value;

        console.log(history.Value);

        if(history.Value.trim().length === 0){
            res.json({noChanges: true});
            return;
        }

        await ticketsData.addHistory(req.params.id, history); 

    }catch(e) {
        res.status(500).json({ error: e });
    }


    try{
        const ticket = await ticketsData.update(req.params.id, modifiedData.title, modifiedData.description, modifiedData.priority, modifiedData.project, modifiedData.status, modifiedData.errorType);
        res.json(ticket);
    }catch(e) {
        res.status(500).json({ error: e });
    }
    
});

router.get('/readyToClose/:id', async(req, res) => {

    try{
        const result = await ticketsData.updateStatus('ready_to_close', req.params.id);
        res.json(result);
    }catch(e) {
        res.status(500).json({ error: e });
    }
});

router.get('/close/:id', async(req, res) => {

    try{
        const result = await ticketsData.updateStatus('closed', req.params.id);
        res.json(result);
    }catch(e) {
        res.status(500).json({ error: e });
    }
});

router.get('/check/edit/:id', async(req, res) => {

    try{
        let ticket = await ticketsData.get(req.params.id);
        
        let isAssignedUser = false;
        
        for(let x of ticket.assignedUsers){
            if(x._id === req.session.user.userId){
                isAssignedUser = true;
                break;
            }
        }
        
        if(ticket.creator !== req.session.user.userId && req.session.user.role !== 1 && !isAssignedUser) {
            res.status(200).json({ NotAuthorized: true });
        }else{
            res.status(200).json({ Authorized: true });
        }

    }catch(e) {
        res.status(500).json({ error: e });
    }
});


module.exports = router;