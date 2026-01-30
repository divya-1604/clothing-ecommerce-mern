const mongoose=require("mongoose")
const categorySchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    parent:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        default:null
  }
},
  { timestamps: true }
);
categorySchema.index({ name: 1, parent: 1 });
module.exports=mongoose.model("Category",categorySchema)