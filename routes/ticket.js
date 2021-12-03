const express = require('express');
const router = express.Router();
const data = require('../data');
const ticketsData = data.tickets;
const projectsData = data.projects;

router.get('/:id', async(req, res) => {

    try{
        const ticket = await ticketsData.get(req.params.id);
        res.json(ticket);
    }catch(e) {
        res.status(500).json({ error: e });
    }
});

router.get('/user/:id', async(req, res) => {

    if(!req.body.tickettype){
        return res.status(500).json({error: "Ticket Type missing"});
    }
    try{
        if(req.body.tickettype = 'created'){
            const createdTickets = await ticketsData.getTicketsByUser(req.params.id, 'creator');
            return res.json(createdTickets);
        }else if(req.body.tickettype = 'assigned'){
            const assignedTickets = await ticketsData.getTicketsByUser(req.params.id, 'assigned');
            return res.json(assignedTickets);
        }
    }catch(e) {
        res.status(500).json({ error: e });
    }
});

router.post('/search', async(req, res) => {

    try{
        if(!req.body.phrase || req.body.phrase.trim().length === 0) {
            throw 'Provided search phrase is empty';
        }
    }catch(e) {
        res.status(403).json({ error: e });
        return;
    }

    try{
        const ticketlist = await ticketsData.searchTicketsByTitle(req.body.phrase);
        if(ticketlist.length === 0){
            res.json({notFound: true});
        }else{
            res.json(ticketlist);
        }
    }catch(e) {
        res.status(500).json({ error: e });
    }
});

router.post('/create', async(req, res) => {

    const ticketData = req.body;

    console.log(ticketData);

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
        ticketsData.isAppropriateString(ticketData.creator, 'creator');
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
        
    //should check if creator exist
    //should check if project exist
        
    /*
    try{
        await projectsData.get(project);
    }catch(e) {
        errors.project_not_exist = e;
    }*/

    if(Object.keys(errors).length !== 0){
        res.status(500).json({ticketData: ticketData, error: true, errors: errors});
        return;
    }
    
    try{
        const ticket = await ticketsData.create(ticketData.title, ticketData.description, ticketData.priority, ticketData.creator, ticketData.project, ticketData.errorType);
        res.json(ticket);
    }catch(e) {
        res.status(500).json({ error: e });
    }
    
});

router.delete('/:id', async (req, res) => {
    try {
        const DeleteInfo = await ticketsData.remove(req.params.id);
        res.status(200).json(DeleteInfo);
    }catch (e) {
        res.status(500).json({ error: e });
    }
});

router.patch('/edit/:id', async(req, res) => {

    const modifiedData = req.body;

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
        ticketsData.isAppropriateString(modifiedData.creator, 'creator');
    }catch(e) {
        errors.creator_error = e;
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
        
    //should check if creator exist
    //should check if project exist
        
    /*
    try{
        await projectsData.get(project);
    }catch(e) {
        errors.project_not_exist = e;
    }*/

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
        const ticket = ticketsData.get(req.params.id);

        if(ticket.title !== modifiedData.title){
            let modify_content = `title: ${modifiedData.title} \n`
            history_value.concat(modify_content);
        }

        if(ticket.description !== modifiedData.description){
            let modify_content = `description: ${modifiedData.description} \n`
            history_value.concat(modify_content);
        }

        if(ticket.creator !== modifiedData.creator){
            let modify_content = `creator: ${modifiedData.creator} \n`
            history_value.concat(modify_content);
        }

        if(ticket.project !== modifiedData.project){
            let modify_content = `project: ${modifiedData.project} \n`
            history_value.concat(modify_content);
        }

        if(ticket.errorType !== modifiedData.errorType){
            let modify_content = `errorType: ${modifiedData.errorType} \n`
            history_value.concat(modify_content);
        }

        if(ticket.priority !== modifiedData.priority){
            let modify_content = `priority: ${modifiedData.priority} \n`
            history_value.concat(modify_content);
        }

        if(ticket.status !== modifiedData.status){
            let modify_content = `status: ${modifiedData.status} \n`
            history_value.concat(modify_content);
        }

        history.Value = history_value;

        if(history.Value.trim().length === 0){
            res.render('/pages/ticketPage', {noChanges: true});
            return;
        }

        await ticketsData.addHistory(req.params.id, history); 

    }catch(e) {
        res.status(500).json({ error: e });
    }


    try{
        const ticket = await ticketsData.update(req.params.id, modifiedData.title, modifiedData.description, modifiedData.creator, modifiedData.project, modifiedData.errorType, modifiedData.status, modifiedData.priority);
        res.json({ticket: ticket, edited: true});
    }catch(e) {
        res.status(500).json({ error: e });
    }
    
});


module.exports = router;