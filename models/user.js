const {Schema, model} = require('mongoose');
const {createHmac,randomBytes} = require('crypto');
const { createTokenForUser } = require('../services/authentication');


const userSchema = new Schema({
    fullName: {type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    salt:{type:String},
    profileImage:{type:String,default:'/images/defaultImage.jpg'},
    role: {type:String,enum:['USER','ADMIN'],default:'USER'}
     
},{timestamps:true})

userSchema.pre('save',function (next){
    const user = this;
    if(!user.isModified('password')){
        return;
    }
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256',salt).update(user.password).digest('hex');

    this.salt = salt;
    this.password = hashedPassword;

    next();

})

userSchema.static('matchPasswordAndGenerateToken',async function (email,password){
    const user = await User.findOne({email});
    if(!user) throw new Error('User Not Found');

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedhash = createHmac("sha256",salt)
    .update(password)
    .digest('hex');
    console.log(hashedPassword)
    console.log(userProvidedhash)
    if(hashedPassword!== userProvidedhash){
        throw new Error('Inccorect password');

    }
    const token = createTokenForUser(user);
    return token;

})

const User = model('user',userSchema);
module.exports = User;