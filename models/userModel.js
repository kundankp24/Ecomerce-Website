const mongoose= require('mongoose');

const user=mongoose.Schema({
    name: {
        type : String,
        required:[true,'Please add a Name']
    },
    email: {
        type : String,
        required:[true,'Please add email']
    },
    password: {
        type :String ,
        required:[ true ,'Password is Required'],
    },
    image: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: [true,"Mobile number is required"]
    },
    type:  {
        type: String,  //admin or user
        required: true
    },
    token: {
        type: String,
        default:''
    }
});
module.exports = mongoose.model("User",user);