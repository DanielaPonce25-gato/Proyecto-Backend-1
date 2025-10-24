import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class CartManager {
    constructor() {
        this.filePath = path.join(__dirname, "../carts.json");
        this.carts = this.loadCarts();
    }

    loadCarts() {
        try {
            if (!fs.existsSync(this.filePath)) {
                fs.writeFileSync(this.filePath, "[]");
            }
            
            const data = fs.readFileSync(this.filePath, "utf-8");
            return JSON.parse(data);

        } catch (error) {
            console.error("Error al leer carts.json:", error);
            return [];
        }
    }

    saveCarts() {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.carts, null, 2));
        } catch (error) {
            console.error("Error al escribir carts.json:", error);
        }
    }

    createCart() {
        const newCart = { id: this.carts.length + 1, products: [] };
        this.carts.push(newCart);
        this.saveCarts();
        return newCart;
    }

    getCartById(id) {
        return this.carts.find(cart => cart.id === parseInt(id));
    }

    addProductToCart(cartId, productId) {
        const cart = this.getCartById(cartId);
        if (!cart) return null;

        const existing = cart.products.find(p => p.id === productId);
        if (existing) existing.quantity++;
        //El producto ya estaba en el carrito. Se incrementa su cantidad

        else cart.products.push({ id: productId, quantity: 1 });

        this.saveCarts();
        return cart;
    }
}
