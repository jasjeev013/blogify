const express = require('express');
const Blog = require('../models/blog');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null,path.resolve(`./public/uploads/`));
    },
    filename: function(req,file,cb){
        cb(null,`${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({storage});

const router = express.Router();

router.get('/add-new',(req,res,next) => {
    return res.render('addblog',{
        user:req.user
    })
})

router.post('/',  upload.single('coverImage'),async (req,res,next) => {
    const {title,body} = req.body;
    const {file} = req.file;

    const blog = await Blog.create({body,title,createdBy:req.user._id,coverImageURL:`/uploads/${req.file.filename}`})
    return res.redirect(`/blog/${blog._id}`);
})

router.get('/:id',async (req,res)=>{
    const blog = await Blog.findById(req.params.id).populate('createdBy');
    console.log(blog)
    return res.render('blog',{
        user:req.user,
        blog,
    })
})

module.exports = router;