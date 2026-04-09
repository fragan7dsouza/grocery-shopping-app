const Product = require('../models/productModel');

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, price, category, stock, image } = req.body;

    if (!name || price === undefined || !category || stock === undefined || !image) {
      res.status(400);
      throw new Error('name, price, category, stock and image are required');
    }

    const product = await Product.create({
      name,
      price,
      category,
      stock,
      image
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, category, stock, image } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    if (name !== undefined) {
      product.name = name;
    }
    if (price !== undefined) {
      product.price = price;
    }
    if (category !== undefined) {
      product.category = category;
    }
    if (stock !== undefined) {
      product.stock = stock;
    }
    if (image !== undefined) {
      product.image = image;
    }

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
};