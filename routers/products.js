import express from 'express';
import { v4 as uuidv4 } from 'uuid'; //generar IDs únicos

const router = express.Router();  // Crea el router de Express

// creo array vacio de productos
let products = [];

// GET /api/products/ Lista todos los productos
router.get('/', (req, res) => {
    res.json(products);
});


// GET /api/products/:pid  Traer producto por id
router.get('/:pid', (req, res) => {
    const product = products.find(p => p.id === req.params.pid); // compara id de los productos

    if (!product) return res.status(404).json({ error: 'Producto no encontrado' }); //Si no existe, error 404
    res.json(product);
});

// POST /api/products/  Agregar un nuevo producto
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

    products.push(newProduct);  // Agrega el nuevo producto al array

    res.status(201).json(newProduct);// mensaje que creo el producto
});

// PUT /api/products/:pid  Actualizar un producto
router.put('/:pid', (req, res) => {

    // Buscar el producto por id si cuyo id coenside
    const productIndex = products.findIndex(p => p.id === req.params.pid); 

    if (productIndex === -1) return res.status(404).json({ error: 'Producto no encontrado' });                      
    

    //actualiza los datos y sobre escribe el producto
    const updatedProduct = { ...products[productIndex], ...req.body, id: products[productIndex].id };
    products[productIndex] = updatedProduct; //reemplaza 

    res.json(updatedProduct);
});

// DELETE /api/products/:pid  Eliminar un producto
router.delete('/:pid', (req, res) => {
    const productIndex = products.findIndex(p => p.id === req.params.pid);
    if (productIndex === -1) return res.status(404).json({ error: 'Producto no encontrado' });

    const deletedProduct = products.splice(productIndex, 1);
    res.json({ message: 'Producto eliminado', product: deletedProduct[0] });
});

export default router;