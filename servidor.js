
import express from 'express';
import http from 'http';

import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import { v4 as uuidv4 } from 'uuid';// generar IDs únicos

import productsRouter from './routers/products.js';
import cartsRouter from './routers/carts.js';
import viewsRouter from './routers/views.js';
import ProductManager from './managers/ProductManager.js';

const app = express();
const PORT = 8080;

// Creamos el servidor HTTP nativo
const server = http.createServer(app);

// Integro Socket.io
const io = new Server(server);

// Instancia de ProductManager (para pasarle productos a las vistas)
const productManager = new ProductManager();

// Configuracion Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Carpeta pública donde se alojan archivos estáticos

// Configuracon Handlebars (Plantilla)
app.engine('handlebars', handlebars.engine());
app.set('views', './views');// Carpeta de vistas
app.set('view engine', 'handlebars');

// Las rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta de vistas
app.use('/', viewsRouter);


// Configurar WebSockets
io.on('connection', (socket) => {
    console.log('Cliente conectado');

    // Envia lista actual de productos al cliente
    socket.emit('products', productManager.getProducts());

    // Escucha el pedido del cliente y Crear producto
    socket.on('newProduct', (data) => {

        const newProduct = {
            id: uuidv4(),      
            status: true,      
            ...data            
        };

        productManager.addProduct(newProduct);
        io.emit('products', productManager.getProducts());
    });

    // Escucha el pedido del cliente y Eliminar producto
    socket.on('deleteProduct', (id) => {
        productManager.deleteProduct(id);
        io.emit('products', productManager.getProducts());
    });

    // Escucha el pedido del cliente y Modificar producto
    socket.on('updateProduct', ({ id, updatedData }) => {
        const updated = productManager.updateProduct(id, updatedData);

        if (updated) {
            // Producto actualizado, envía la lista actualizada
            io.emit('products', productManager.getProducts());
        } else {
            // Producto no encontrado, envía mensaje de error al cliente
            socket.emit('error', `No se encontró el producto con ID ${id}`);
        }
    });
});


// Levanta el servidor
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});




