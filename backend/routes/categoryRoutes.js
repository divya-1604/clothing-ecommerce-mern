const express=require("express");
const router=express.Router();
const{createCategory,getAllCategories,getSubCategories}=require("../controllers/categoryController");
const { protect } = require("../middlewares/authMiddleware");
const { adminProtect } = require("../middlewares/adminMiddleware");


