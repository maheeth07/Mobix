const { validationResult } = require('express-validator');
const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const blacklistTokenSchema = require('../models/blacklistToken.model');
module.exports.registerUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // accept either { fullname: { firstname, lastname } } or firstname/lastname at root
        const { fullname, firstname, lastname, email, password } = req.body;
        const first = (fullname && fullname.firstname) || firstname;
        const last = (fullname && fullname.lastname) || lastname || '';

        const hashedPassword = await userModel.hashPassword(password);

        const user = await userService.createUser({
            firstname: first,
            lastname: last,
            email,
            password: hashedPassword,
        });

        const token = user.generateAuthToken();
        const userObj = user.toObject ? user.toObject() : user;
        if (userObj.password) delete userObj.password;
        res.status(201).json({ user: userObj, token });
    } catch (err) {
        next(err);
    }
};


module.exports.loginUser=async(req,res,next)=>{
    try{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }
        const {email,password}=req.body;
        const user=await userModel.findOne({email}).select('+password');
        if(!user){
            return res.status(401).json({message:'Invalid email or password'});
        }
        const isMatch=await user.comparePassword(password);
        if(!isMatch){
            return res.status(401).json({message:'Invalid email or password'});
        }
        const token=user.generateAuthToken();
        // set cookie for 24h to match token expiry
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:'lax',
            maxAge:24*60*60*1000
        });
        const userObj = user.toObject ? user.toObject() : user;
        if (userObj.password) delete userObj.password;
        res.status(200).json({user:userObj,token});
    }catch(err){
        next(err);
    }
}

module.exports.getUserProfile=async(req,res,next)=>{
    try{
        const user = req.user;
        if(!user) return res.status(404).json({message:'User not found'});
        const userObj = user.toObject ? user.toObject() : user;
        if (userObj.password) delete userObj.password;
        res.status(200).json(userObj);
    }catch(err){
        next(err);
    }
}

module.exports.logoutUser=async(req,res,next)=>{
    try{
        res.clearCookie('token');
        const token = req.token || (req.cookies && req.cookies.token) || (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[1]);
        if (token) {
            try {
                await blacklistTokenSchema.create({ token });
            } catch (err) {
                // ignore duplicate key error (token already blacklisted)
                if (!(err.code && err.code === 11000)) {
                    throw err;
                }
            }
        }
        res.status(200).json({message:'Logged out successfully'});
    }catch(err){
        next(err);
    }
}