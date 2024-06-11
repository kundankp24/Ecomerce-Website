const mongoose= require('mongoose');

const categorySchema=mongoose.Schema({
    category: {
        type : String,
        required:[true,'Please add a Category']
    }
});

module.exports= mongoose.model("Category", categorySchema);
