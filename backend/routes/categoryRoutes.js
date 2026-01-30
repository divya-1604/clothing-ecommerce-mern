const express=require("express");
const router=express.Router();
const{createCategory,getAllCategories,getSubCategories}=require("../controllers/categoryController");
const { protect } = require("../middlewares/authMiddleware");
const { adminProtect } = require("../middlewares/adminMiddleware");

router.post("/",protect,adminProtect,createCategory);   
router.get("/",getAllCategories);
router.get("/subcategories/:parentId",getSubCategories);

module.exports=router;

