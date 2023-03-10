

import express from "express";
import multer from "multer";
import { getAllProduct, createProduct, getSingleProduct, deleteProduct, updateProduct } from "../controllers/productController.js";
import path, { resolve } from 'path';

// init router
const router = express.Router();
const __dirname = resolve();

// product photo upload
const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname)
    },
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '/api/public/images/products'))
    }
});


const productMulter = multer({
    storage
}).fields([
    {
        name: 'photo',
        maxCount: 1
    },
    {
        name: 'gallery',
        maxCount: 10
    }
])

//route prodcut
router.get('/', getAllProduct);
router.post('/', productMulter, createProduct);
router.route('/:id').get( getSingleProduct).delete(deleteProduct).put(updateProduct);

//user auth route

// export default router
export default router;


