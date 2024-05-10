import { Database } from "../config/database.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const Register = async (req, res) => {
    const { store_name, email, phone, password } = req.body;
    const parsedPhone = parseInt(phone);
    const user_id = store_name + phone;

    if (!store_name || !email || !phone || !password) {
        return res.status(204).json({ message: "Failed to resgiter, No Content" });
    };

    const isEmailExist = await Database.user.findMany({
        where: { 
            email: email
        }
    });
    
    if (!isEmailExist){
        if (email === isEmailExist[0].email) {
            return res.status(409).json({ message: "Email already exist" });
        };
    };

    const isPhoneExist = await Database.user.findMany({
        where: {
            phone: parsedPhone
        }
    });

    if (!isPhoneExist){
        if (parsedPhone === isPhoneExist[0].phone) {
            return res.status(409).json({ message: "Phone number already exist" });
        };
    };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        await Database.user.create({
            data: {
                user_id: user_id,
                store_name: store_name,
                email: email,
                phone: parsedPhone,
                password: hashedPassword
            }
        });
        res.status(201).json({ 
            message: "User created successfully",
            data: {
                user_id: user_id,
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const Login = async (req, res) => {
    try {
        const user = await Database.user.findMany({
            where: {
                email: req.body.email
            }
        });

        if (user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        };

        const validPassword = await bcrypt.compare(req.body.password, user[0].password);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid password" });
        };

        const { user_id, store_name, email, phone } = user[0];
        const accessToken = jwt.sign({ user_id, store_name, email, phone }, process.env.JWT_SECRET, { expiresIn: "30d" });
        res.status(200).json({ 
            message: "Login successful",
            data: {
                accessToken: accessToken,
                user_id: user_id,
            }
         });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
        console.log(error);
    }
}