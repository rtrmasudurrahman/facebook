
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Token from '../models/Token.js';
import createError from "./errorController.js";
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utility/sendEmail.js';
import { createToken } from '../utility/createToken.js';
import { sendSms } from '../utility/sendSms.js'
import { json } from 'express';


/**
 * @access public
 * @ route /api/user
 * @ method GET
*/
export const getAllUser = async (req, res, next) => {

    
    try {
        const users = await User.find();
        res.status(200).json(users);
        
    } catch (error) {
        next(error);
    }
}

/**
 * @access public
 * @ route /api/student
 * @ method Post
*/
export const createUser = async (req, res, next) => {
    
    //make hash password
    const salt = await bcrypt.genSalt(10);
    const hash_pass = await bcrypt.hash(req.body.password, salt);

    try {
        const user = await User.create({ ...req.body, password: hash_pass });
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}
/**
 * @access public
 * @ route /api/student/:id
 * @ method Post
*/
export const getSingleUser = async(req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        
        if (!user) {
            return next(createError(404, "Single student not found"));
        }
        if (user) {
            res.status(200).json(user);
        }    
      
    } catch (error) {
        next(error);
    }
}

/**
 * @access public
 * @ route /api/student/:id
 * @ method Put/patch
*/
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
    }
}

/**
 * @access public
 * @ route /api/student/:id
 * @ method Delete
*/
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        res.status(200).json(user);

    } catch (error) {
        console.log(error);
    }
}



// for auth controller

/**
 * @access public
 * @ route /api/user/login
 * @ method Post
*/
export const userLogin = async (req, res, next) => {

    //get body data
    
    
    try {
        //find user
        const login_user = await User.findOne({ email: req.body.email });

        //check user exist ore not
        if (!login_user) {
            return next(createError(404, 'User not found'));
        }
        
        const password_check = await bcrypt.compare(req.body.password, login_user.password);

         //password handle
        if (!password_check) {
            return next(createError(404, 'Wrong password'));
        }

        //create a token
        const token = jwt.sign({ id: login_user._id, isAdmin: login_user.isAdmin }, process.env.JWT_SECRET);

        //login user info
        const { password, isAdmin, ...login_info } = login_user._doc;
        
        res.cookie("access_token", token).status(200).json({

            token : token,
            user: login_info
        })
        
    } catch (error) {
        next(error);
    }
    
  
}

/**
 * @access public
 * @ route /api/user/register
 * @ method Post
*/
export const userRegister = async (req, res, next) => {
    
    //make hash password
    const salt = await bcrypt.genSalt(10);
    const hash_pass = await bcrypt.hash(req.body.password, salt);

    try {
        //user data send
        const user = await User.create({ ...req.body, password: hash_pass });
        //create a token
        const token = createToken({ id: user._id });
        //token update
        await Token.create({
            userId: user._id,
            token: token
        });
                
        //send activation link
        const verify_link = `http://localhost:3000/user/${user._id}/verify/${token}`;

        await sendEmail(user.email, 'Verify Account', verify_link);
                       
        res.status(200).json(user);
        
    } catch (error) {
        next(error);
    }
}

/**
 * @access public
 * @ route /api/me
 * @ method GET
*/
export const getLoggedInUser = async (req, res, next) => {

    try {

        //get token
        const bearer_token = req.headers.authorization;
        let token = '';

        if (bearer_token) {
            token = bearer_token.split(' ')[1];

            // get token user
            const logged_in_user = jwt.verify(token, process.env.JWT_SECRET);

            // user check
            if (!logged_in_user) {
                next(createError(400, 'Invalid token'));
            }

            if (logged_in_user) {
                
                const user = await User.findById(logged_in_user.id);
                res.status(200).json(user);

            }
        }

        //check token exists
        if (!bearer_token) {
            next(createError(404, 'Token not found'));
        }
        
        
    } catch (error) {
        next(error);
    }
}

//verify user axccount
export const verifyUserAccount = async (req, res, next) => {
    
    try {
        const { id, token } = req.body;
        
        const verify = await Token.findOne({ userId: id, token: token });

        
        if (!verify) {
            next(createError(404, 'Invalid verify url'))
        }
        if (verify) {
            await User.findByIdAndUpdate(id, {
                isVerified: true
            } )
            res.status(200).json({ messgae: 'User account verified successful' });
            verify.remove()
        }

    } catch (error) {
        
    }
}

// recover password link geneate
export const recoverPassword = async (req, res, next) => {
    
    try {
        const { email } = req.body;
        //check email
        const recover_user = await User.findOne({ email });
        

        //check email exists 
        if (!recover_user) {
            res.status(404).json({
                message: 'Email does not exists',
            });
        }

        if ( recover_user ) {

            const token = createToken({ id : recover_user._id }, '1m');                    
            const recovery_url = `http://localhost:3000/password-recover/${ token }`;

            sendEmail(recover_user.email, 'Password Reset', recovery_url);
            
            res.status(200).json({
                message: "password recover link sent"
            });
            
        }
        

    } catch (error) {
        next(createError(error));
    }
}

//reset user password

 export const ResetPassword = async (req, res, next) => {
    
     try {
         
         const { token, password } = req.body;
        

         const user = jwt.verify(token, process.env.JWT_SECRET);
         const user_id = user.data.id

         if (user) {
             // make hash password
            const salt = await bcrypt.genSalt(10);
            const hash_pass = await bcrypt.hash(password, salt);
        
             const user_datails = await User.findByIdAndUpdate(user_id, {
                 password : hash_pass
             });
             res.send("password changed successfully");
         }

    } catch (error) {
        next(createError(401, 'Time out'))
    }
 }