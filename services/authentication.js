const JWT = require('jsonwebtoken');
const secret = '##jabdj4o^&**%cdjcsd'

const  createTokenForUser = (user) =>{
    const payload = {
        _id:user._id,
        email:user.email,
        profileimageURL: user.profileimageURL,
        role:user.role,

    };
    const token = JWT.sign(payload,secret);
    return token;
}

const validateToken= (token) =>  {
    const payload = JWT.verify(token,secret);
    return payload;
}

module.exports={
    createTokenForUser,
    validateToken,
}