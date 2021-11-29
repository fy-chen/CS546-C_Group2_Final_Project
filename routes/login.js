const express = require('express');
const router = express.Router(); 
const users = require("../data").users;

router.post('/',async(req,res) =>{

    const loginResponse =  await users.login(req.body);
    // res.status(200).render("./pages/signupPage",{title:'Signup', userCreated: userCreated});
    console.log(loginResponse)
    if (loginResponse.login==true){
        req.session.user ={ username: loginResponse.username, userId : loginResponse.userId ,userRole: loginResponse.userRole }
        res.status(200).json(loginResponse);
    }
    else{
        res.status(401).json(loginResponse);
    }
    
    
    
});


module.exports = router;