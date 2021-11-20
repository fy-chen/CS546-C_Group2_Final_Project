const jwt = require("jsonwebtoken");
const SECRET_KEY = "Wu-Tang is Forever";


module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, SECRET_KEY,function(err, decoded) {
            if (err){
                console.log("err: "+err);
                res.status(200).json({ token:'invalid',message: "access token invalid.", path: '/singin' });
            }
            else{
                console.log(decoded);
                req.body.username = decoded.name;
                req.body.userrole = decoded.role;
                req.body.secret = decoded.secret;
                next();
            }
            
            });
    } catch (error) {
        console.log("err: "+error);
        res.status(200).json({ token:'invalid',message: "access token invalid." });
    }
};