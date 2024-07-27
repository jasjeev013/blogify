const express = require('express');
const Blog = require('../models/blog');

const multer = require('multer');
const path = require('path');
const Comment = require('../models/comment');

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
    const comments =await Comment.find({blogId:req.params.id}).populate('createdBy');
    return res.render('blog',{
        user:req.user,
        blog,
        comments,
    })
})


router.post('/comment/:blogId',async (req,res)=>{
    const {content} = req.body;
    const comment = await Comment.create({content,blogId:req.params.blogId,createdBy:req.user._id});
    return res.redirect(`/blog/${req.params.blogId}`);

})

module.exports = router;