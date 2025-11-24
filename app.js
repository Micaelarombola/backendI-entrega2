const express = require('express');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');

const productsRouter = require('./src/routes/products.router');
const cartsRouter = require('./src/routes/carts.router');
const ProductManager = require('./src/managers/ProductManager');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Ruta del archivo de productos (data/products.json)
const productsFilePath = path.join(__dirname, 'data', 'products.json');
const productManager = new ProductManager(productsFilePath);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src', 'views'));

// Rutas API (las que ya tenías)
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// VISTA HOME – lista de productos por HTTP
app.get('/', async (req, res) => {
  try {
    const products = await productManager.getAll();
    res.render('home', { products });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cargar productos');
  }
});

// VISTA REAL TIME – se completa con websockets
app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});

// SOCKET.IO
io.on('connection', async socket => {
  console.log('Cliente conectado:', socket.id);

  try {
    const products = await productManager.getAll();
    socket.emit('products', products); // lista inicial
  } catch (err) {
    console.error(err);
  }

  // Crear producto desde WebSocket
  socket.on('newProduct', async data => {
    try {
      if (data.status === undefined) data.status = true;
      await productManager.create(data);
      const updated = await productManager.getAll();
      io.emit('products', updated); // actualiza para todos
    } catch (err) {
      console.error(err);
      socket.emit('errorMessage', err.message);
    }
  });

  // Eliminar producto desde WebSocket
  socket.on('deleteProduct', async id => {
    try {
      await productManager.delete(id);
      const updated = await productManager.getAll();
      io.emit('products', updated);
    } catch (err) {
      console.error(err);
    }
  });
});

const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
