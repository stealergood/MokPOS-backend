import { Database } from "../config/database.js";

function getCurrentDate() {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const hour = currentDate.getHours();
    const minute = currentDate.getMinutes();
    const second = currentDate.getSeconds();

    const formattedDay = (day < 10 ? '0' : '') + day;
    const formattedMonth = (month < 10 ? '0' : '') + month;
    const formattedHour = (hour < 10 ? '0' : '') + hour;
    const formattedMinute = (minute < 10 ? '0' : '') + minute;
    const formattedSecond = (second < 10 ? '0' : '') + second;

    return formattedDay + formattedMonth + year + formattedHour + formattedMinute + formattedSecond;
}

async function orderHandler (user_id, product) {
    const transaction_id = "TRX" + getCurrentDate();
    const orderData = [];

    product.forEach(async (item) => {
        const product_id = parseInt(item.product_id);
        const quantity = parseInt(item.quantity);
        let newStock = 0;

        orderData.push({
            user_id: user_id,
            transaction_id: transaction_id,
            product_id: product_id,
            quantity: quantity,
        });

        await Database.product.findUnique({
            where: {
                product_id: product_id
            }
        })
        .then(product => {
            if (product.length == 0) {
                return res.status(404).json({ message: "Product not found" });
            }
            
            if (product.stock < quantity) {
                return res.status(400).json({ message: "Insufficient stock" });
            }

            newStock = product.stock - quantity;
        })
        .catch(error => {
            console.log(error);
            return res.status(500).json({ message: "Error while update stock!" });
        });

        await Database.product.update({
            where: {
                product_id: product_id
            },
            data: {
                stock: newStock
            }
        })

    });
    return orderData;
}

async function transactionHandler(user_id, orderData, amount, payment, placement_order){
    const transaction_id = orderData[0].transaction_id;

    const transactionData = {
        transaction_id: transaction_id,
        user_id: user_id,
        amount: amount,
        payment_method: payment,
        placement_order: placement_order,
    }
 
    return transactionData;
}


export const PlaceOrder = async (req, res) => {
    const { user_id, product, amount, payment, placement_order } = req.body;

    await Database.user.findMany({
        where: {
            user_id: user_id
        }
    })
    .then (user => {
        if (user.length == 0) {
            return res.status(404).json({ message: "User not found" });
        }
    })
    .catch (error => {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    });

    if (placement_order !== "dine_in" && placement_order !== "takeaway") {
        return res.status(400).json({
            message: "Invalid placement order, must dine_in or takeaway"
        });
    }

    const orderData = await orderHandler(user_id, product);
    const transactionData = await transactionHandler(user_id, orderData, amount, payment, placement_order);
    
    try {
        await Database.transaction.create({
            data: transactionData
        });
        await Database.order.createMany({
            data: orderData
        });

        return res.status(200).json({ 
            code: 200,
            status: "success",
            message: "Order placed successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}