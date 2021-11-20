const express = require('express');
const router = express.Router();

router.get('/',async(req,res) =>{
    res.render('pages/loginPage');
});


module.exports = router;