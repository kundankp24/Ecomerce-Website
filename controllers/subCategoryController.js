const Subcategory= require('../models/subCategoryModel');

const create_subcategory= async(req, res)=>{
    try {

        const check_sub= await Subcategory.find({category_id:req.body.category_id});

        if(check_sub.length>0){
            let checking= false;

            for(let i=0; i<check_sub.length; i++){
                if(check_sub[i]['sub_category'].toLowerCase()===req.body.sub_category.toLowerCase()){
                    checking=true;
                    break;
                }
            }
            if(checking){
                return res.status(422).send({success: true, message:"This Sub-category already exist"});
            }
            else{
                const subCategory= new Subcategory({
                    category_id: req.body.category_id,
                    sub_category: req.body.sub_category
                });
                const sub_cat_data= await subCategory.save();
                res.status(200).send({success: true, message: "Sub Category details", data: sub_cat_data});
            }
        }
        else{
            const subCategory= new Subcategory({
                category_id: req.body.category_id,
                sub_category: req.body.sub_category
            });
            const sub_cat_data= await subCategory.save();
            res.status(200).send({success: true, message: "Sub Category details", data: sub_cat_data});
        }
    } catch (error) {
        res.status(400).send({success: false, message: error.message});
    }
}

module.exports= {create_subcategory};