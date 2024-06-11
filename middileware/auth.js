const jwt= require("jsonwebtoken");
const config= require("../config/config");

const verifyToken= async(req, res, next)=>{
    const token= req.body.token || req.query.token || req.headers['authorization'];

    if(!token){
        return res.status(200).send({sucess: false, message: "A token is required for authentication"});
    }
    else{
        try {
            
            const descode=jwt.verify(token, config.secret_jwt);
            req.user=descode;
            return next();
    
        } catch (error) {
            return res.status(400).send("Invalid Token");
        }
    }
}
module.exports= verifyToken;