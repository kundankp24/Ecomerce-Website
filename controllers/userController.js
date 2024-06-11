const User= require('../models/userModel');
const bcryptjs= require('bcryptjs');
const config= require("../config/config");
const jwt= require("jsonwebtoken");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");
const fs= require('fs');

const sendResetPasswordMail=async(name, email, token)=>{
    try {
        
        const transporter=nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port : 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.emailUser,
                pass: config.emailPassword
            } 
        });
        const mailOptions= {
            from: config.emailUser,
            to: email,
            subject: 'For Reset Password',
            html: '<p> Hi'+ name+ ', please copy the link and <a href="http://127.0.0.1.:3000/api/reset-password?token='+token+'"> Reset Your Password</a> ',
        }
        //send the mail
        transporter.sendMail(mailOptions, (error, info)=>{
            if(error){
                console.log(error.message);
            }
            else{
                console.log("Mail has been sent:-", info.response);
            }
        });

    } catch (error) {
        res.status(400).send(error.message);
    }
}

const create_token= async (id)=>{
    try{
        const token = await jwt.sign({_id:id }, config.secret_jwt);
        return token;
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const securePassword= async (password)=>{
    try {
        
        const passwordHash= await bcryptjs.hash(password, 10);
        return passwordHash;

    } catch (error) {
        res.status(400).send(error.message);
        console.log(error);
    }
}

const register_user= async (req, res)=>{
    try {
        const spassword= await securePassword(req.body.password);
        const user=new User({
            name: req.body.name,
            email: req.body.email,
            password: spassword,
            image: req.file.filename,
            type: req.body.type,
            mobile: req.body.mobile
        });
        const userData= await User.findOne({email: req.body.email});
        if(userData){
            res.status(400).send({success:false, message:"User already exist"});
        }
        else{
            const user_data=await user.save();
            res.status(200).send({success:true, data: user_data, message:"User registered successfully"});
        }

    } catch (error) {
        res.status(400).send(error.message);
        console.log(error);
    }
}

const login_user= async (req, res)=>{
    try {
        
        const email= req.body.email;
        const password= req.body.password;

        const userData= await User.findOne({email: email});

        if(userData){
            const passwordMatch= await bcryptjs.compare(password, userData.password);

            if(passwordMatch){
                const tokenData= await create_token(userData._id);
                const userResult= {
                    _id: userData._id,
                    name: userData.name,
                    email: userData.email,
                    password: userData.password,
                    image: userData.image,
                    mobile: userData.mobile,
                    type: userData.type,
                    token: tokenData
                }
                const response={
                    success : true ,
                    msg: "User Details",
                    data: userResult
                }
                res.status(200).send(response);
            }
            else{
                res.status(400).send({status: "failed", message: "Password is incorrect"});
            }

        }else{
            res.status(400).send({status: "failed", message: "You are not registered"});
        }

    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
}

const update_password= async(req, res)=>{
    try {
        
        const user_id= req.body.user_id;
        const password= req.body.password;

        const data= await User.findOne({_id: user_id});

        if(data){
            const newPassword= await securePassword(password);
            const userData = await User.updateOne({"_id": user_id}, {"$set":{password: newPassword}});
            // const userData =await  User.findByIdAndUpdate({"_id": user_id}, {$set:{password: newPassword}});

            res.status(200).send({status: "Success", message: "Your Password has been updated"});
        }
        else{
            res.status(400).send({status: "failed", message: "User id not found"});
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const forget_password= async (req, res)=>{
    try {
        const email=req.body.email;
        const userData= await User.findOne({email: email});

        if(userData){
            const randomString= randomstring.generate();
            const data= await User.updateOne({email: email}, {$set: {token: randomString}});
            // send mail to the user with token and link for resetting password
            sendResetPasswordMail(userData.name, userData.email, randomString);
            res.status(400).send({status: "Success", message: "Please check your mail and reset the password"});
        }
        else{
            res.status(400).send({status: "failed", message: "Email id does not found"});
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const reset_password= async (req, res)=>{
    try {
        const token= req.query.token;
        const tokenData=await User.findOne({token: token});
        if(tokenData){
            const password= req.body.password;
            const newPassword= await securePassword(password);
            const userData=await User.findByIdAndUpdate({_id:tokenData._id}, {$set: {password:newPassword, token: ''}},{new:true});
            res.status(400).send({status: "Success", message: "Password has been reset", data: userData});
            
        }else{
            res.status(400).send({status: "failed", message: "This link has been expired"});
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//renew token
const renew_token=  async(id)=>{
    try {

        const secret_jwt= config.secret_jwt;
        const newSecretJwt= randomstring.generate();

        fs.readFile('config/config.js', 'utf-8', (error, data)=>{
            if(error){
                throw error;
            }
            var newValue=data.replace(new RegExp(secret_jwt, 'g'), newSecretJwt)
            fs.writeFile('config/config.js', newValue,'utf-8', (error, data)=>{
                if(error){
                    throw error;
                }
                console.log("Done!");
            });
        });
        const token = await jwt.sign({ _id: id }, newSecretJwt);
        return token;

    } catch (error) {
        res.status(400).send(error.message);
    }
}

const refresh_token= async (req, res)=>{
    try {

        const user_id= req.body.user_id;
        const userData= await User.findById({_id: user_id});

        if(userData){
            const tokenData= await renew_token(user_id);
            const response={
                user_id: user_id,
                token: tokenData,
            }
            res.status(200).send({status: "Success", message:"Refresh Token Details", data: response});

        }else{
            res.status(200).send({status: "Success", message:"User not found"});
        }

    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports={ register_user, login_user, update_password, forget_password, reset_password, refresh_token};

