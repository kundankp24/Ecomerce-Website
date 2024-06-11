const express= require('express');
const user_routes= express.Router();
const bodyParser=require('body-parser');
user_routes.use(bodyParser.json());
user_routes.use(bodyParser.urlencoded({extended: true}));

// middileware
const auth= require('../middileware/auth');

const multer= require('multer');
const path= require('path');
var fs = require("fs");

user_routes.use(express.static('public'));

//multer implementation
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, path.join(__dirname, '../public/userImages'), (error, success)=>{
            if(err){
                throw error;
            }
        })
    },
    filename : function(req , file, cb) {
        const name=Date.now() + '-'+file.originalname;
        cb(null, name,  (error, success)=>{
            if(error){
                throw error;
            }
        })
    }
});

const upload= multer({storage: storage});

//Controller file
const user_controller= require("../controllers/userController");

//routes creation for register
user_routes.post('/register', upload.single('image'), user_controller.register_user);

//routes creation for Login
user_routes.post('/login',  user_controller.login_user);

//this api is created just for testing purpose
user_routes.get('/test', auth, async (req, res)=>{
    res.status(200).send({seccess: true, message: "authenticated"});
});

//update pasword
user_routes.post("/update-password", user_controller.update_password);

//Forget Password
user_routes.post("/forget-password", user_controller.forget_password);

//Reset Password
user_routes.post("/reset-password", user_controller.reset_password);

//invalidate ols JWT token
user_routes.post("/refresh-token", auth, user_controller.refresh_token);

module.exports= user_routes;





