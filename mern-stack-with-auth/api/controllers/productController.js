import Product from "../models/Product.js"
import createError from "./errorController.js";

// get all product
export const getAllProduct = async (req, res, next) => {
    
    try {
        const products = await Product.find();
        res.status(200).json(products)   
    } catch (error) {
        next(createError(next));
    }
   
}

export const createProduct = async (req, res, next) => {

    try {
        
        
        
        let gallery = []
        for (let i = 0; i < req.files.gallery.length; i++){
            gallery.push(req.files.gallery[i].filename)
        }
      const product = await Product.create({
          ...req.body,
          photo : req.files.photo[0].filename, 
          gallery: gallery,
          category: req.body.category.split(','),
          tags: req.body.tags.split(',')
        
    });
    if (product) {
        res.status(200).json({
            message: 'Product created successfully',
            product
        });
    } else{
        next(createError(401, 'Product not created'));
    }
        
    }catch (error) {
      next(createError(error));
  }
}

export const getSingleProduct = async (req, res, next) => {
    
    const { id } = req.params;
    try {
        const product = await Product.findById(id);

        res.status(200).json(product);

    } catch (error) {
        next(createError(error));
    }
    
}

export const updateProduct = async (req, res, next) => {
    
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndUpdate(id, req.body);
        if (product) {
            res.status(200).json({
                message: 'Product update successfully'
            })
            
        }
    } catch (error) {
        next(createError(error));
    }


}

export const deleteProduct = async (req, res, next) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndDelete(id);
        if (product) {
            res.status(200).json({
                message: 'Product deleted successfully'
            });
        }
    } catch (error) {
        next(createError(error));
    }
}