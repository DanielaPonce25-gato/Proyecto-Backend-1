
import express from 'express';
import { v4 as uuidv4 } from 'uuid'; //generar IDs únicos

const router = express.Router();  // Crea el router de Express

// creo array vacio de carrito
let carts = [];


router.post('/', (req, res) => {

    const newCart = {
        id: uuidv4(), 
        products: [] // Inicia vacío
    };

    carts.push(newCart);
    res.status(201).json(newCart);
});


// Para ver el carrito

router.get('/:cid', (req, res) => {

    const cart = carts.find(c => c.id === req.params.cid);

    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.json(cart.products);
});


// Para Agregar productos al carrito 

router.post('/:cid/product/:pid', (req, res) => {


    const cart = carts.find(c => c.id === req.params.cid);

    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const productId = req.params.pid;

    const existingProduct = cart.products.find(p => p.product === productId);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.products.push({ product: productId, quantity: 1 });
    }

    res.status(201).json(cart);
});


export default router;
