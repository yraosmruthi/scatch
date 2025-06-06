const mongoose = require('mongoose');


const ownerSchema = mongoose.Schema({
   fullname:{
        type:String,
        minLength:3,
        trim:true,
    },
    email:String,
    password:String,
    products:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product"
    },
    ]
   
    

});
module.exports=mongoose.model('owner',ownerSchema);