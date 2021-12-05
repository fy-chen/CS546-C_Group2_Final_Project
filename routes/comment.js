const express = require('express');
const router = express.Router();
const data = require('../data');
const commentData = data.comments;
const ticketData = data.tickets;

router.get('/:id', async(req, res) => {
    try {
        const comment = await commentData.get(req.params.id);
    } catch (e) {
        res.status(500).json({error:e});
    }
});

router.get('/getAll', async(req, res) => {
    try {
        const comments = await commentData.getAll();
        res.json(comments);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.post('/create', async(req, res) => {
    const commentData = req.body;
    let errors = {};

    // try {
    //     ticketData.isAppropriateString(commentData.text,"text");
    // } catch (e) {
    //     errors.text_error = e;
    // }

    // if(Object.keys(err))

    try {
        const comment = await commentData.create(commentData.ticketId, commentData.text, commentData.userId);
        res.json(comment)
    } catch (e) {
        res.status(500).json({error : e});
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const DeletInfro = await commentData.remove(req.params.id);
        res.status(200).json(DeletInfro);
    } catch (e) {
        res.status(500).json({error:e});
    }
});

module.exports = router;