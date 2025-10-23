import http from 'http';
import expressApp from './express.js'; 

const PORT = 8080;

// Creamos el servidor HTTP nativo usando la app de Express
const server = http.createServer(expressApp);


// Inicia el servidor
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});


// servidor.js se encarga de levantar el puerto
