const express = require('express');
const router = express.Router();
const data = require('../data');
const ticketsData = data.tickets;

router.get('/',async(req,res) =>{
    res.render('pages/ticketPage');
});

router.get('/:id', async(req, res) => {

    try{
        const ticket = ticketsData.get(req.params.id);
        res.render('pages/ticketPage', {ticket});
    }catch(e) {
        res.status(500).json({"error": e});
    }
});

router,get('/user/:id', async(req, res) => {

    try{
        const createdTickets = ticketsData.getTicketsByUser(req.params.id, 'creator');
        const assignedTickets = ticketsData.getTicketsByUser(req.params.id, 'assigned');
        res.render('pages/ticketPage', {createdTickets: createdTickets, assignedTickets: assignedTickets});
    }catch(e) {
        res.status(500).json({"error": e});
    }
});

router.post('/search', async(req, res) => {

    try{
        if(!req.body.phrase || req.body.phrase.trim().length === 0) {
            throw 'Provided search phrase is empty';
        }
    }catch(e) {
        res.status(403).json({"error": e});
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
        res.status(500).json({"error": e});
    }
});


module.exports = router;