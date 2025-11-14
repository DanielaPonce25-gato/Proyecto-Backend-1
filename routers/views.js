
import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager();

// Vista principal
router.get('/home', (req, res) => {
    const products = productManager.getProducts();
    res.render('home', { products });
});

// Vista en tiempo real (con websockets)
router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

export default router;
