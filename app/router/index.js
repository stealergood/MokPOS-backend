import { Register, Login } from '../controller/authentication.js';
import { GetProduct, GetProductbySearch, CreateProduct, UpdateProduct, DeleteProduct } from '../controller/product.js';
import { GetCategory, CreateCategory, UpdateCategory, DeleteCategory } from '../controller/category.js';
import { PlaceOrder } from '../controller/cashier.js';
import { AuthVerify } from '../middleware/jwtVerify.js';
// import { multerMiddleware } from '../middleware/multer.js';
import express from 'express';

const router = express.Router();

router.post('/login', Login);
router.post('/register', Register);

router.get('/product/:name', AuthVerify, GetProductbySearch);
router.get('/product', AuthVerify, GetProduct);
router.post('/product', AuthVerify, CreateProduct);
router.put('/product', AuthVerify, UpdateProduct);
router.delete('/product', AuthVerify, DeleteProduct);

router.get('/category', AuthVerify, GetCategory);
router.post('/category', AuthVerify, CreateCategory);
router.put('/category', AuthVerify, UpdateCategory);
router.delete('/category', AuthVerify, DeleteCategory);

router.post('/order', AuthVerify, PlaceOrder);

export default router;