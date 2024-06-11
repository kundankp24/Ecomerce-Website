const express= require('express');
const store_routes= express.Router();
const bodyParser=require('body-parser');
store_routes.use(bodyParser.json());
store_routes.use(bodyParser.urlencoded({extended: true}));

const multer= require('multer');
const path= require('path');

// middileware
const auth= require('../middileware/auth');

//Controller file
const store_controller= require("../controllers/storeController");

store_routes.use(express.static('public'));

const storage= multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, path.join(__dirname, '../public/storeImages'), (error, success)=>{
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

//routes
store_routes.post("/create-store", auth, upload.single('logo'), store_controller.create_store);

module.exports= store_routes;