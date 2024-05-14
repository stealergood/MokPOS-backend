import { Database } from "../config/database.js";
import cloudinary from "../config/cloudinary.js";

export const GetProductbySearch = async (req, res) => {
    const user_id = req.body;
    const product_name = req.params.name

    try {
        const user = await Database.user.findMany({
            where: {
                user_id: user_id
            }
        });

        if (user.length == 0) {
            return res.status(404).json({ message: "User not found" });
        };

        const product = await Database.product.findMany({
            where: {
                product_name: product_name
            }
        });

        if (product.length == 0) {
            return res.status(404).json({ message: "Product not found" });
        };

        res.status(200).json({
            message: "Success get product",
            data: product
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const GetProduct = async (req, res) => {
    const { user_id } = req.body

    try {
        const user = await Database.user.findMany({
            where: {
                user_id: user_id
            }
        })

        if (user.length == 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const product = await Database.product.findMany({
            where: {
                user_id: user_id
            }
        });

        if (product == 0) {
            return res.status(404).json({ message: "No Product Exist" })
        }

        res.status(200).json({
            message: "Success Get Product",
            data: product
        
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    };
};

export const CreateProduct = async (req, res) => {
    const { user_id, product_name, price, stock, category_id } = req.body;
    const image = req.file.path;

    try {
        const user = await Database.user.findMany({
            where: {
                user_id: user_id
            }
        })

        if (user.length == 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const productDb_name = await Database.product.findMany({
            where: {
                product_name: product_name
            }
        });

        const categoryDb = await Database.category.findMany({
            where: {
                category_id: parseInt(category_id)
            }
        });

        if (categoryDb.length == 0){
            return res.status(404).json({ message: "Category not found" });
        }

        if (!productDb_name.length == 0){
            if (product_name === product_name) {
                return res.status(409).json({ message: "Product already exist" });
            };
        };

        const imageUri = await cloudinary.uploader.upload(image)

        await Database.product.create({
            data: {
                user_id: user_id,
                product_name: product_name,
                image: imageUri.url,
                image_public_id: imageUri.public_id,
                price: parseFloat(price),
                stock: parseInt(stock),
                category_id: parseInt(category_id)
            }
        });

        res.status(201).json({ 
            message: "Product created successfully",
            data: {
                product_name: product_name,
                image: imageUri.url,
                image_public_id: imageUri.public_id,
                price: price,
                stock: stock,
                category_id: category_id
            } 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    };
};

export const UpdateProduct = async (req, res) => {
    const { user_id, product_id } = req.body;
    let updateData = {};
    
    if (req.body.product_name) {
        updateData.product_name = req.body.product_name;
    }
    if (req.file) {
        updateData.image = req.file.path;
    }
    if (req.body.price) {
        updateData.price = req.body.price;
    }
    if (req.body.stock) {
        updateData.stock = req.body.stock;
    }
    if (req.body.category_id) {
        updateData.category_id = req.body.category_id;
    }

    try {
        const user = await Database.user.findMany({
            where: {
                user_id: user_id
            }
        })

        if (user.length == 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const productDb = await Database.product.findMany({
            where: {
                product_id: product_id
            }
        });

        if (productDb.length == 0){
            return res.status(404).json({ message: "Product not found" });
        };

        await Database.product.update({
            where: {
                product_id: product_id
            },
            data: updateData
        });

        res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    };
}

export const DeleteProduct = async(req, res) => {
    const { user_id, product_id } = req.body;

    try {
        const user = await Database.user.findMany({
            where: {
                user_id: user_id
            }
        })

        if (user.length == 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const productDB = await Database.product.findMany({
            where: {
                product_id: parseInt(product_id)
            }
        })

        if (productDB.length == 0){
            return res.status(404).json({ message: "No Product Exist" });
        }

        await cloudinary.uploader.destroy(productDB[0].image_public_id);

        await Database.product.delete({
            where: {
                product_id: parseInt(product_id)
            }
        });

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}