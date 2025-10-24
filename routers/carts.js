
import express from 'express';

import CartManager from "../managers/CartManager.js"; // Ruta donde esta el json

const router = express.Router();  // Crea el router de Express

// creo la ruta donde van a estar almacenado el carrito
const cartManager = new CartManager();


// creo carrito
router.post("/", (req, res) => {
    const newCart = cartManager.createCart();
    res.status(201).json(newCart);
});


// Para ver el carrito
router.get("/:cid", (req, res) => {
    const cart = cartManager.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart.products);
});


// Para Agregar productos al carrito 
router.post("/:cid/product/:pid", (req, res) => {
    const cart = cartManager.addProductToCart(req.params.cid, req.params.pid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.status(201).json(cart);
});


export default router;
