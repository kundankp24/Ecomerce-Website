const express= require('express');
const subcategory_routes= express.Router();
const bodyParser=require('body-parser');
subcategory_routes.use(bodyParser.json());
subcategory_routes.use(bodyParser.urlencoded({extended: true}));

// middileware
const auth= require('../middileware/auth');

//Controller file
const subcatogry_controller= require("../controllers/subCategoryController");

//routes
subcategory_routes.post('/add-sub-category', auth, subcatogry_controller.create_subcategory);

module.exports= subcategory_routes;