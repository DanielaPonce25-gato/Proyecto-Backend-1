import fs from "fs"; // me permite leer y escribir archivos en el sistema

import path from "path"; // me ayuda a manejar las rutas de archivo

import { fileURLToPath } from "url"; // contiene la cadena URL (fileURLToPath) del archivo


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//__filename : Devuelve la ruta absoluta al archivo actual (ProductManager.js)

//__dirname : Devuelve la ruta absoluta a la carpeta principal (products.json)

export default class ProductManager {

    constructor() {
        //Guarda la ruta donde esta el archivo
        this.filePath = path.join(__dirname, "../products.json");  

        // Carga los productos al archivo usando el método load
        this.products = this.loadProducts();
    }

    loadProducts() {
        try {
            if (!fs.existsSync(this.filePath)) {  // Existe o no existe el archivo

                fs.writeFileSync(this.filePath, "[]"); 
                // Si no exite crea un array vacio en el json
            }
            const data = fs.readFileSync(this.filePath, "utf-8");
            return JSON.parse(data); // Convierte de texto JSON
        }catch (error) {
            console.error("Error al leer el archivo products.json:", error);
            return [];
        }
    }

    // Guarda producto nuevo 
    saveProducts() {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2));//
        } catch (error) {
            console.error("Error al escribir el archivo products.json:", error);
        }
    }

    addProduct(product) {
        this.products.push(product); // Lo guarda al array interno
        this.saveProducts(); //actualiza el archivo JSON
        return product;
    }

    getProducts() {
        return this.products; // Producto cargado nuevo
    }

    getProductById(id) {
        return this.products.find(p => p.id === id); //Busca y devuelve el producto cuyo id coincide
    }


    // Actualiza el producto existente
    updateProduct(id, updatedFields) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) return null;
        this.products[index] = { ...this.products[index], ...updatedFields };
        this.saveProducts();
        return this.products[index];
    }

    // Eliminar un producto
    deleteProduct(id) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) return null;
        const deleted = this.products.splice(index, 1);
        this.saveProducts();
        return deleted[0];
    }
}
