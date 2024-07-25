const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const cookieParser = require('cookie-parser');
const checkForAuthenticationCookie = require('./middlewares/authentication')

const app = express();
const PORT = 3000;

mongoose
    .connect('mongodb://localhost:27017/blogify')
    .then((e) => console.log('MongoDB Connected'))

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))


app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'))


const userRoute = require('./routes/users');


app.use('/user', userRoute);


app.get('/', (req, res, next) => {
    res.render('home',{
        user:req.user,
    })
})



app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
})