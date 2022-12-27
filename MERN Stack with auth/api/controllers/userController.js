
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import createError from "./errorController.js"
import jwt from 'jsonwebtoken'

/**
 * @access public
 * @ route /api/user
 * @ method GET
*/
export const getAllUser = async (req, res, next) => {

    
    try {
        const users = await User.find()
        res.status(200).json(users)
        
    } catch (error) {
        next(error)
    }
}

/**
 * @access public
 * @ route /api/student
 * @ method Post
*/
export const createUser = async (req, res, next) => {
    
    //make hash password
    const salt = await bcrypt.genSalt(10)
    const hash_pass = await bcrypt.hash(req.body.password, salt)

    try {
        const user = await User.create({...req.body, password : hash_pass})
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}
/**
 * @access public
 * @ route /api/student/:id
 * @ method Post
*/
export const getSingleUser = async(req, res, next) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)
        
        if (!user) {
            return next(createError(404, "Single student not found"))
        }
        if (user) {
            res.status(200).json(user)
        }    
      
    } catch (error) {
        next(error)
    }
}

/**
 * @access public
 * @ route /api/student/:id
 * @ method Put/patch
*/
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findByIdAndUpdate(id, req.body, {new : true})
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
    }
}

/**
 * @access public
 * @ route /api/student/:id
 * @ method Delete
*/
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findByIdAndDelete(id)
        res.status(200).json(user)

    } catch (error) {
        console.log(error)
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
        const login_user = await User.findOne({ email : req.body.email })

        //check user exist ore not
        if (!login_user) {
            return next(createError(404, 'User not found'))
        }
        
        const password_check = await bcrypt.compare(req.body.password, login_user.password)

         //password handle
        if (!password_check) {
            return next(createError(404, 'Wrong password'))
        }

        //create a token
        const token = await jwt.sign({ id: login_user._id, isAdmin: login_user.isAdmin }, process.env.JWT_SECRET)

        //login user info
        const { password, isAdmin, ...login_info } = login_user._doc
        
        res.cookie("access_token", token).status(200).json({

            token : token,
            user: login_info
        })
        
    } catch (error) {
        next(error)
    }
    
  
}

/**
 * @access public
 * @ route /api/user/register
 * @ method Post
*/
export const userRegister = async (req, res, next) => {
    
    //make hash password
    const salt = await bcrypt.genSalt(10)
    const hash_pass = await bcrypt.hash(req.body.password, salt)

    try {
        const user = await User.create({...req.body, password : hash_pass})
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}