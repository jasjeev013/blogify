require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const cookieParser = require('cookie-parser');
const checkForAuthenticationCookie = require('./middlewares/authentication')

const app = express();
const PORT = process.env.PORT || 3000;

mongoose
    .connect(process.env.MONGO_URL)
    .then((e) => console.log('MongoDB Connected'))

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))


app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'))
app.use(express.static(path.resolve('./public')))


const Blog = require('./models/blog');


const userRoute = require('./routes/users');
const blogRoute = require('./routes/blog');


app.use('/user', userRoute);
app.use('/blog', blogRoute);


app.get('/', async (req, res, next) => {
    const allBlogs = await Blog.find({createdBy:req.user});
    res.render('home',{
        user:req.user,
        blogs: allBlogs
    })
})



app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
})