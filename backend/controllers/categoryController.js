const Category=require("../models/Category");


exports.createCategory=async(req,res)=>{
   const{name,parent}=req.body;
   try{
    if(!name){
        return res.status(400).json({message:"Category name is required"});
    }
    // const existingCategory=await Category.findOne({name,parent:parent||null});
    // const existingCategory=await Category.findOne({name,parent:parent?parent:null});
    const existingCategory=await Category.findOne({name});
    if(existingCategory){
        return res.status(400).json({message:"Category with the same name already exists"});
    }
    const Category=await Category.create({
        name,
        parent: parent||null,
   });
   res.status(201).json({message:"Category created successfully",Category});
}catch(error){
    res.status(500).json({message:error.message});
}
};

exports.getAllCategories=async(req,res)=>{
    try{
        const categories=await Category.find()
        .populate("parent","name")
        .sort({createdAt:1});

    res.json(categories);
    }catch(error){
        res.status(500).json({message:error.message});
    }
}

exports.getSubCategories=async(req,res)=>{
    try{
        const subCategories=await Category.find({parent:req.params.parentId})
        .sort({createdAt:1});
        res.json(subCategories);
    }catch(error){
        res.status(500).json({message:error.message});
    }
}