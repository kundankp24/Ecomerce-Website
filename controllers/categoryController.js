const Category= require('../models/categoryModel');

const addcategory= async (req, res)=>{
    try {

        const category_data= await Category.find();

        if(category_data.length>0){
            let checking=false;
            for(let i = 0; i<category_data.length; i++){
                if(category_data[i]['category'].toLowerCase()===req.body.category.toLowerCase()){
                    checking=true;
                    break;
                }
            }
            if(checking){
                return res.status(422).send({success: true, message:"Category already exist"});
            }
            else{
                const category=new Category({
                    category: req.body.category
                });
                
                const cat_data= await category.save();
                res.status(200).send({success: true, message: "category data", data: cat_data});
            }
        }
        else{
            const category=new Category({
                category: req.body.category
            });
            const cat_data= await category.save();
            res.status(200).send({success: true, message: "category data", data: cat_data});
        }

    } catch (error) {
        res.status(400).send({success: false, message: error.message});
    }
}
 module.exports= {addcategory};