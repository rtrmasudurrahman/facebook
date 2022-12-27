

import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createUser, deleteUser, getAllUser, getSingleUser, updateUser, userLogin, userRegister, getLoggedInUser, verifyUserAccount, recoverPassword, ResetPassword } from "../controllers/userController.js";
import { userMiddleware } from "../middlewares/userMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

// init router
const router = express.Router();

//user auth route
router.post('/login', userLogin);
router.post('/register', userRegister);
router.get('/me', getLoggedInUser);
router.post('/verify', verifyUserAccount);
router.post('/recover-password', recoverPassword);
router.post('/reset-password', ResetPassword);



//route REST API
router.route('/').get(adminMiddleware, getAllUser).post(adminMiddleware, createUser);
router.route('/:id').get(userMiddleware, getSingleUser).delete(userMiddleware, deleteUser).put(userMiddleware, updateUser).patch(userMiddleware, updateUser);



// export default router
export default router;


