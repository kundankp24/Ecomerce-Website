const Store= require('../models/storeModel');
const User= require('../models/userModel');

const create_store= async(req, res)=>{
    try {
       const userData= await User.findOne({_id: req.body.vendor_id});
       if(userData){
            if(!req.body.latitude || !req.body.longitude){
                res.status(200).send({status: false, message: "please provide latitude and longitude"});
            }
            else{
                const venderData= await Store.findOne({vendor_id: req.body.vendor_id});

                if(venderData){
                    res.status(200).send({status: false, message: "This Vender already created a store"});
                }else{
                    const store= new Store({
                        vendor_id :  req.body.vendor_id ,
                        logo: req.file.filename,
                        business_email: req.body.business_email,
                        address: req.body.address,
                        pin: req.body.pin,
                        location: {
                            type: "Point",
                            coordinates:[parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
                        }
                    });
                    const storeData= await store.save();
                    res.status(200).send({status: true, message: "Vendor Store is successfully created", data: storeData});
                }
            }
       }
       else{
            res.status(200).send({status: false, message: "Vendor Id does not exist"});
       }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports= {create_store};
