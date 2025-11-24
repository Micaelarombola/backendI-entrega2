const socket = io();

const list = document.getElementById('productsList');
const createForm = document.getElementById('createForm');
const deleteForm = document.getElementById('deleteForm');

// Renderizar la lista de productos
socket.on('products', products => {
  list.innerHTML = '';
  products.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${p.title}</strong> - $${p.price} (ID: ${p.id})`;
    list.appendChild(li);
  });
});

// Mostrar errores enviados desde el servidor (opcional)
socket.on('errorMessage', msg => {
  alert('Error: ' + msg);
});

// Crear producto
createForm.addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData(createForm);
  const data = Object.fromEntries(formData.entries());

  // Adaptar datos al ProductManager
  data.price = Number(data.price);
  data.stock = Number(data.stock);
  data.status = true;

  if (data.thumbnails) {
    data.thumbnails = data.thumbnails.split(',').map(t => t.trim());
  } else {
    data.thumbnails = [];
  }

  socket.emit('newProduct', data);
  createForm.reset();
});

// Eliminar producto
deleteForm.addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData(deleteForm);
  const id = formData.get('id');
  socket.emit('deleteProduct', id);
  deleteForm.reset();
});
