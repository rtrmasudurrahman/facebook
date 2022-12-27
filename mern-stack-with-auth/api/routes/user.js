

import express from "express"
import { authMiddleware }  from "../middlewares/authMiddleware.js"
import { createUser, deleteUser, getAllUser, getSingleUser, updateUser, userLogin, userRegister } from "../controllers/userController.js"
import { userMiddleware } from "../middlewares/userMiddleware.js"
import { adminMiddleware } from "../middlewares/adminMiddleware.js"

// init router
const router = express.Router()


//route REST API
router.route('/').get(adminMiddleware, getAllUser).post(adminMiddleware, createUser)
router.route('/:id').get(userMiddleware, getSingleUser).delete(userMiddleware, deleteUser).put(userMiddleware, updateUser).patch(userMiddleware, updateUser)

//user auth route
router.post('/login', userLogin)
router.post('/register', userRegister)

// export default router
export default router


