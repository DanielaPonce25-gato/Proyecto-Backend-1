const socket = io();

// Escucha y muestra los productos 
socket.on('products', (products) => {
    const tableBody = document.getElementById('productTable');
    tableBody.innerHTML = '';

    products.forEach(p => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${p.id}</td>
            <td>${p.title}</td>
            <td>${p.description}</td>
            <td>${p.code}</td>
            <td>$${p.price}</td>
            <td>${p.status}</td>
            <td>${p.stock}</td>
            <td>${p.category}</td>
            <td>
                ${p.thumbnails?.length
                    ? `<img src="${p.thumbnails[0]}" width="60" alt="${p.title}">`
                    : 'Sin imagen'}
            </td>
            <td>
                <button onclick="deleteProduct('${p.id}')">🗑️ Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
});


// Agregar producto
document.getElementById('productForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;

    const newProduct = {
        title: form.title.value,
        description: form.description.value,
        code: form.code.value,
        price: parseFloat(form.price.value),
        status: form.status.value === 'true',
        stock: parseInt(form.stock.value),
        category: form.category.value,
        thumbnails: form.thumbnails.value ? [form.thumbnails.value] : []
    };

    socket.emit('newProduct', newProduct);
    form.reset();
});


// Modificar producto
document.getElementById('updateForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const id = form.id.value.trim();

    if (!id) {
        alert("Debes ingresar un ID válido");
        return;
    }

    const updatedData = {};

    if (form.title.value) updatedData.title = form.title.value;
    if (form.description.value) updatedData.description = form.description.value;
    if (form.code.value) updatedData.code = form.code.value;
    if (form.price.value) updatedData.price = parseFloat(form.price.value);
    if (form.status.value !== "") updatedData.status = form.status.value === "true";
    if (form.stock.value) updatedData.stock = parseInt(form.stock.value);
    if (form.category.value) updatedData.category = form.category.value;
    if (form.thumbnails.value) updatedData.thumbnails = [form.thumbnails.value];

    if (Object.keys(updatedData).length === 0) {
        alert("Debes completar al menos un campo para modificar");
        return;
    }

    console.log("Enviando update:", id, updatedData); 
    socket.emit('updateProduct', { id, updatedData });
    form.reset();
});


// Elimina producto por formulario
document.getElementById('deleteForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = e.target.elements.id.value.trim();
    if (confirm('¿Seguro que quieres eliminar este producto?')) {
        socket.emit('deleteProduct', id);
    }
    e.target.reset();
});


// Elimina producto desde botón de tabla
window.deleteProduct = function(id) {
    if (confirm('¿Seguro que quieres eliminar este producto?')) {
        socket.emit('deleteProduct', id);
    }
};
