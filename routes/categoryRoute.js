const express= require('express');
const category_routes= express.Router();
const bodyParser=require('body-parser');
category_routes.use(bodyParser.json());
category_routes.use(bodyParser.urlencoded({extended: true}));

// middileware
const auth= require('../middileware/auth');

//Controller file
const catogry_controller= require("../controllers/categoryController");

//routes
category_routes.post('/add-category', auth, catogry_controller.addcategory);

module.exports= category_routes;