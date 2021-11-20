const express = require('express');
const router = express.Router();    
const users = require('../data').users;
const crypto = require('crypto'); 


router.post('/',async(req,res) =>{
    const body = req.body;
    const salt = crypto.randomBytes(16).toString('hex'); 
    const hash = crypto.pbkdf2Sync(password, salt,  
    1000, 64, `sha512`).toString(`hex`);
    
    
});

module.exports = router;