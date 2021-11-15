const express = require('express');
const router = express.Router();

router.get('/',async(req,res) =>{
    res.render('pages/landingPage');
});


module.exports = router;