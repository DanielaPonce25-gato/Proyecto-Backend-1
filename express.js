import express from "express";
import http from 'http';
import productsRouter from './routers/products.js';
import cartsRouter from './routers/carts.js'; 

const app = express();
const PORT = 8080;


app.use(express.json());


app.get("/", (req, res) => {
    console.log("Ruta 1");
    res.send("¡Hola desde la ruta GET!");
});

app.post("/", (req, res) => {
    console.log("Ruta 2");
    res.send("¡Hola desde la ruta POST!");
});


// Registro de rutas

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

export default app;