const express = require('express');
const router = express.Router(); 
const users = require("../data").users;

router.post('/',async(req,res) =>{

    const userCreated =  await users.signin(req.body);
    // res.status(200).render("./pages/signupPage",{title:'Signup', userCreated: userCreated});
    
    res.status(200).json({message: userCreated});
    
    
});


module.exports = router;