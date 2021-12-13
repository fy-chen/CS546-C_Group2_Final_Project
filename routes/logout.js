const express = require('express');
const router = express.Router();

router.get('/', async (req,res) => {
    try{
        req.session.destroy();
        res.status(200).json({loggedOut:true});
    }
    catch(e){
        res.status(500).json({loggedOut:false, error: e})
    }
    
    
});

module.exports = router