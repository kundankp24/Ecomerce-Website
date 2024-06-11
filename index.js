const express= require('express');
const app= express();
const mongoose= require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/ECOM');

// user router 
const user_routes= require('./routes/userRoute');
app.use('/api', user_routes);

// store router 
const store_routes= require('./routes/storeRoutes');
app.use('/api', store_routes);

//category router
const category_routes= require('./routes/categoryRoute');
app.use('/api', category_routes);

//Subcategory router
const subcategory_routes= require('./routes/subCategoryRoute');
app.use('/api', subcategory_routes);

app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})
