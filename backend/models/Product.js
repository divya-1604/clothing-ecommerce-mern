const mongoose=require("mongoose");

const productSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
      },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true,
    },
    sizes:{
        type:[String],
        default:[],
    },
    colors:{
        type:[String],
        default:[],
    },
    gender: {
        type: String,
        enum: ["Men", "Women", "Kids"],
      },
    brand:{
        type:String,
        required:true,
    },
    countInStock:{
        type:Number,
        default:0,
    },
    rating:{
        type:Number,
        default:0,
    },
    numReviews:{
        type:Number,
        default:0,
    },
    images:{
        type:[String],
        default:[],
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }
}, { timestamps: true })
productSchema.pre("save", function (next) {
    if (this.isModified("name")) {
      this.slug = this.name
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
    }
    next();
  });
module.exports=mongoose.model("Product",productSchema);