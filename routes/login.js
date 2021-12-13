const express = require('express');
const router = express.Router(); 
const users = require("../data").users;
const xss = require('xss');

router.get('/',async(req,res)=>{
    if (xss(req.session.user)){
        res.status(200).json({loggedIn:true, role :parseInt(xss(req.session.user.userRole))});
    }
    else{
        res.status(200).json({loggedIn: false});
    }
});

router.post('/',async(req,res) =>{
     let username = xss(req.body.username);
     let password = xss(req.body.password);
     username = username.toLowerCase();
    try {
        const loginResponse =  await users.login(username,password);
        console.log(loginResponse)
        if (loginResponse.login==true){
            req.session.user ={ username: loginResponse.username, userId : loginResponse.userId ,userRole: loginResponse.userRole }
            res.status(200).json(loginResponse);
        }
        else{
            res.status(401).json(loginResponse);
        }
    }
    catch(e){
        res.sendStatus(500);
    }

    // res.status(200).render("./pages/signupPage",{title:'Signup', userCreated: userCreated});
    
    
    
    
});


module.exports = router;