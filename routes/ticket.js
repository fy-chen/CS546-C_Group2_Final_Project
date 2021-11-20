const express = require('express');
const router = express.Router();
const data = require('../data');
const ticketsData = data.tickets;
const projectsData = data.projects;

router.get('/',async(req,res) =>{
    res.render('pages/ticketPage');
});

router.get('/:id', async(req, res) => {

    try{
        const ticket = ticketsData.get(req.params.id);
        res.render('pages/ticketPage', {ticket});
    }catch(e) {
        res.status(500).json({ error: e });
    }
});

router.get('/user/:id', async(req, res) => {

    try{
        const createdTickets = ticketsData.getTicketsByUser(req.params.id, 'creator');
        const assignedTickets = ticketsData.getTicketsByUser(req.params.id, 'assigned');
        res.render('pages/ticketPage', {createdTickets: createdTickets, assignedTickets: assignedTickets});
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
        const ticketlist = ticketsData.searchTicketsByTitle(req.body.phrase);
        if(ticketlist.length === 0){
            res.render('pages/ticketPage', {notFound: true});
        }else{
            res.render('pages/ticketPage', {tickets: ticketlist});
        }
    }catch(e) {
        res.status(500).json({ error: e });
    }
});

router.get('/create', async(req, res) => {

    try{
        res.render('pages/tickPage');
    }catch(e) {
        res.status(500).json({ error: e });
    }
    
});

router.post('/create', async(req, res) => {

    const ticketData = req.body;

    let errors = {};

    try{
        ticketsData.isAppropriateString(title, 'title');
    }catch(e) {
        errors.title_error = e;
    }

    try{
        ticketsData.isAppropriateString(description, 'description');
    }catch(e) {
        errors.description_error = e;
    }

    try{
        ticketsData.isAppropriateString(creator, 'creator');
    }catch(e) {
        errors.creator_error = e;
    }
        
    try{
        ticketsData.isAppropriateString(project, 'project');
    }catch(e) {
        errors.project_error = e;
    }
        
    try{
        ticketsData.isAppropriateString(errorType, 'errorType');
    }catch(e) {
        errors.errorType_error = e;
    }

    try{
        if(isNaN(Number(priority))) throw 'Provided priority should not be NaN';
        else if(Number(priority) !== 1 || Number(priority) !== 2 || Number(priority) !== 3) throw 'Provided priority not valid';
    }catch(e) {
        errors.priority_error = e;
    }
        
    //should check if creator exist
    //should check if project exist
        
    try{
        await projectsData.get(project);
    }catch(e) {
        errors.project_not_exist = e;
    }

    if(Object.keys(errors).length !== 0){
        res.render('pages/ticketPage', {ticketData: ticketData, error: true, errors: errors});
        return;
    }
    
    try{
        const ticket = await ticketsData.create(ticketData.title, ticketData.description, ticketData.priority, ticketData.creator, ticketData.project, ticketData.errorType);
        res.render('pages/ticketPage', {ticket: ticket});
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

router.get('/edit/:id', async(req, res) => {

    try {
        const ticket = ticketsData.get(id);
        res.render('/pages/ticketPage', {ticket:ticket});
    }catch(e) {
        res.status(500).json({ error: e });
    }
});


module.exports = router;