import express from 'express';
import { v4 as uuidv4 } from 'uuid'; //generar IDs únicos

import ProductManager from "../managers/ProductManager.js"; // Ruta donde esta el json

const router = express.Router();  // Crea el router de Express


// creo la ruta donde van a estar almacenado los productos
const productManager = new ProductManager();


// GET /api/products/ Lista todos los productos
router.get('/', (req, res) => {
    res.json(productManager.getProducts());
});


// GET /api/products/:pid  Traer producto por id
router.get('/:pid', (req, res) => {
    const product = productManager.getProductById(req.params.pid); // compara id de los productos

    if (!product) return res.status(404).json({ error: 'Producto no encontrado' }); //Si no existe, error 404
    res.json(product);
});

// POST /api/products/  crea un nuevo producto
router.post('/', (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    //valida que todos los campos                     //true o false
    if (!title || !description || !code || !price || status === undefined || !stock || !category || !thumbnails) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const newProduct = {
        id: uuidv4(), // ID único generado
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
    };

    productManager.addProduct(newProduct); 
    //Agrega el nuevo producto a la ruta donde se encuetra json

    res.status(201).json(newProduct);// mensaje que creo el producto
});

// PUT /api/products/:pid  Actualizar producto
router.put("/:pid", (req, res) => {
    const datamodifi = productManager.updateProduct(req.params.pid, req.body);
    if (!datamodifi) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(datamodifi);
});

// DELETE /api/products/:pid  Eliminar un producto
router.delete("/:pid", (req, res) => {
    const deleted = productManager.deleteProduct(req.params.pid);
    if (!deleted) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ message: "Producto eliminado", product: deleted });
});

export default router;