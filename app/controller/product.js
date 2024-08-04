import { Database } from "../config/database.js";
import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

export const GetProductbySearch = async (req, res) => {
  const user_id = req.body;
  const product_name = req.params.name;

  try {
    const user = await Database.user.findMany({
      where: {
        user_id: user_id,
      },
    });

    if (user.length == 0) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const product = await Database.product.findMany({
      where: {
        product_name: product_name,
      },
    });

    if (product.length == 0) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Success get product",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const GetProduct = async (req, res) => {
  const { user_id } = req.query;

  try {
    const user = await Database.user.findMany({
      where: {
        user_id: user_id,
      },
    });

    if (user.length == 0) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const product = await Database.product.findMany({
      where: {
        user_id: user_id,
      },
    });

    if (product == 0) {
      return res.status(404).json({
        status: "error",
        message: "No Product Exist",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Success Get Product",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const CreateProduct = async (req, res) => {
  const { user_id, product_name, price, stock, category_id, image } = req.body;

  if (!user_id || !product_name || !price || !stock || !category_id || !image) {
    return res.status(400).json({
      status: "error",
      message: "All fields are required",
    });
  }

  if (!image) {
    return res.status(400).json({
      status: "error",
      message: "Image URI is required",
    });
  }

  try {
    const user = await Database.user.findMany({
      where: { user_id: user_id },
    });

    if (user.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const productDb_name = await Database.product.findMany({
      where: { product_name: product_name },
    });

    const categoryDb = await Database.category.findMany({
      where: { category_id: parseInt(category_id) },
    });

    if (categoryDb.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Category not found",
      });
    }

    if (productDb_name.length !== 0) {
      return res.status(409).json({
        status: "error",
        message: "Product already exists",
      });
    }
    let buffer;
    if (image.startsWith('data:image')) {
      // Handle base64 encoded image
      const base64Data = image.split(';base64,').pop();
      buffer = Buffer.from(base64Data, 'base64');
    } else {
      throw new Error('Unsupported image format. Please send a base64 encoded image.');
    }
    const imageUri = await uploadToCloudinary(buffer);

    const newProduct = await Database.product.create({
      data: {
        user_id: user_id,
        product_name: product_name,
        image: imageUri.url,
        image_public_id: imageUri.public_id,
        price: parseFloat(price),
        stock: parseInt(stock),
        category_id: parseInt(category_id),
      },
    });
    
    res.status(201).json({
      status: "success",
      message: "Product created successfully",
      data: newProduct
    });

  } catch (error) {
    console.log("Error creating product:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const UpdateProduct = async (req, res) => {
  const { user_id, product_id, product_name, price, stock, category_id, image } = req.body;

  if (!user_id || !product_id) {
    return res.status(400).json({
      status: "error",
      message: "User ID and Product ID are required",
    });
  }

  try {
    const user = await Database.user.findUnique({
      where: { user_id: user_id },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const existingProduct = await Database.product.findUnique({
      where: { product_id: parseInt(product_id) },
    });

    if (!existingProduct) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    let updateData = {};

    if (product_name) {
      const productWithSameName = await Database.product.findFirst({
        where: { 
          product_name: product_name,
          NOT: { product_id: parseInt(product_id) }
        },
      });

      if (productWithSameName) {
        return res.status(409).json({
          status: "error",
          message: "Product name already exists",
        });
      }

      updateData.product_name = product_name;
    }

    if (price) {
      updateData.price = parseFloat(price);
    }

    if (stock) {
      updateData.stock = parseInt(stock);
    }

    if (category_id) {
      const categoryDb = await Database.category.findUnique({
        where: { category_id: parseInt(category_id) },
      });

      if (!categoryDb) {
        return res.status(404).json({
          status: "error",
          message: "Category not found",
        });
      }

      updateData.category_id = parseInt(category_id);
    }

    if (image) {
      let buffer;
      if (image.startsWith('data:image')) {
        const base64Data = image.split(';base64,').pop();
        buffer = Buffer.from(base64Data, 'base64');
      } else {
        throw new Error('Unsupported image format. Please send a base64 encoded image.');
      }

      const imageUri = await uploadToCloudinary(buffer);

      // Delete old image from Cloudinary if it exists
      if (existingProduct.image_public_id) {
        await deleteFromCloudinary(existingProduct.image_public_id);
      }

      updateData.image = imageUri.url;
      updateData.image_public_id = imageUri.public_id;
    }

    const updatedProduct = await Database.product.update({
      where: { product_id: parseInt(product_id) },
      data: updateData,
    });
    
    res.status(200).json({
      status: "success",
      message: "Product updated successfully",
      data: updatedProduct
    });

  } catch (error) {
    console.log("Error updating product:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const DeleteProduct = async (req, res) => {
  const { user_id, product_id } = req.body;

  try {
    const user = await Database.user.findMany({
      where: {
        user_id: user_id,
      },
    });

    if (user.length == 0) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const productDB = await Database.product.findMany({
      where: {
        product_id: parseInt(product_id),
      },
    });

    if (productDB.length == 0) {
      return res.status(404).json({
        status: "error",
        message: "No Product Exist",
      });
    }

    await cloudinary.uploader.destroy(productDB[0].image_public_id);

    await Database.product.delete({
      where: {
        product_id: parseInt(product_id),
      },
    });

    res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
