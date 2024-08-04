import { Database } from "../config/database.js";

export const GetCategory = async (req, res) => {
    const { user_id } = req.query;

    try {
        const category = await Database.category.findMany({
            where: {
                user_id: user_id
            }
        });

        if (category == 0) {
            return res.status(404).json({
                status: "error", 
                message: "No Category" 
            })
        }

        res.status(200).json({
            status: "success",
            message: "Category found",
            data: category
        
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            status: "error",
            message: "Internal server error" 
        });
    };
};

export const CreateCategory = async (req, res) => {
    const { user_id, category_name } = req.body;

    try {
        const user = await Database.user.findMany({
            where: {
                user_id: user_id
            }
        })

        if (user.length == 0) {
            return res.status(404).json({
                status: "error", 
                message: "User not found" 
            });
        }

        const categoryDb_name = await Database.category.findMany({
            where: {
                category_name: category_name,
            }
        });

        if (categoryDb_name.length > 0) {
            return res.status(409).json({ 
                status: "error",
                message: "Category already exists" 
            });
        }

        const newCategory = await Database.category.create({
            data: {
                user_id: user_id,
                category_name: category_name
            }
        });

        res.status(201).json({ 
            status: "success",
            message: "Category created successfully",
            data: newCategory
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            status: "error",
            message: "Internal server error"
        });
    };
};

export const UpdateCategory = async (req, res) => {
    const { user_id, category_id, category_name } = req.body;

    try {
        const user = await Database.user.findMany({
            where: {
                user_id: user_id
            }
        })

        if (user.length == 0) {
            return res.status(404).json({ 
                status: "error",
                message: "User not found" 
            });
        }

        const categoryDb = await Database.category.findMany({
            where: {
                category_id: parseInt(category_id)
            }
        });

        if (categoryDb.length === 0) {
            return res.status(404).json({ 
                status: "error",
                message: "Category not found" 
            });
        };

        const categoryDb_name = await Database.category.findMany({
            where: {
                category_name: category_name,
            }
        });

        if (categoryDb_name.length > 0) {
            return res.status(409).json({ 
                status: "error",
                message: "Category already exists" 
            });
        }

        const updateCategory = await Database.category.update({
            where: {
                category_id: parseInt(category_id)
            },
            data: {
                category_name: category_name
            }
        });

        res.status(200).json({ 
            status: "success",
            message: "Category updated successfully",
            data: updateCategory
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            status: "error",
            message: "Internal server error"
        });
    };
};

export const DeleteCategory = async (req, res) => {
    const { user_id, category_id } = req.body;

    try {
        const user = await Database.user.findMany({
            where: {
                user_id: user_id
            }
        })

        if (user.length == 0) {
            return res.status(404).json({ 
                status: "error",
                message: "User not found" 
            });
        }

        const categoryDb = await Database.category.findMany({
            where: {
                category_id: parseInt(category_id)
            }
        });

        if (categoryDb.length === 0) {
            return res.status(404).json({ 
                status: "error",
                message: "Category not found" 
            });
        };

        await Database.category.delete({
            where: {
                category_id: parseInt(category_id)
            }
        });

        res.status(200).json({ 
            status: "success",
            message: "Category deleted successfully" 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            status: "error",
            message: "Internal server error" 
        });
    };
}
