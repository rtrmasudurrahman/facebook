
import createError from '../controllers/errorController.js'
import  Jwt from 'jsonwebtoken'

export const adminMiddleware = (req, res, next) => {
    
    const token = req.cookies.access_token
    try {
        if (!token) {
            return next(createError(401, 'Your are not authenticated'))
        }
        // if login
        const login_user = Jwt.verify(token, process.env.JWT_SECRET)

        if (!login_user) {
            return next(createError(401, 'Invalid token'))
        }

        if (!login_user.isAdmin) {
            return next(createError(401, 'Only Admin can acces this features'))
        }

        if (login_user) {
            req.user = login_user
            next()
        }
        
    } catch (error) {
        next(error)
    }
}