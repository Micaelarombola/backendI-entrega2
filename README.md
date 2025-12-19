# Backend Ecommerce – Entrega Final

Proyecto backend desarrollado en Node.js con Express y MongoDB para la gestión de productos y carritos de compra.

Esta entrega corresponde a la **Entrega Final**, incorporando persistencia en MongoDB mediante Mongoose y la implementación completa de endpoints para productos y carritos.

---

## 🛠 Tecnologías utilizadas
- Node.js
- Express
- MongoDB
- Mongoose
- Thunder Client (para testing de endpoints)

---

## 📦 Funcionalidades implementadas

### Productos
- Crear producto
- Listar productos
- Obtener producto por ID
- Actualizar producto
- Eliminar producto

### Carritos
- Crear carrito
- Obtener carrito por ID
- Obtener todos los carritos
- Agregar producto a un carrito
- Actualizar cantidad de un producto en el carrito
- Eliminar un producto del carrito
- Vaciar carrito completo
- Visualización de productos con `populate`

---

## 🚀 Instalación y ejecución del proyecto

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/backend-ecommerce-mongodb.git

2️⃣ Instalar dependencias
npm install

3️⃣ Variables de entorno

Crear un archivo .env en la raíz del proyecto con el siguiente contenido:

PORT=8080
MONGO_URL=mongodb://localhost:27017/ecommerce

4️⃣ Ejecutar el servidor
node app.js
El servidor se ejecutará por defecto en:

http://localhost:8080

🌐 Endpoints disponibles
📌 Productos

POST /api/products

GET /api/products

GET /api/products/:pid

PUT /api/products/:pid

DELETE /api/products/:pid

📌 Carritos

POST /api/carts

GET /api/carts

GET /api/carts/:cid

POST /api/carts/:cid/products/:pid

PUT /api/carts/:cid/products/:pid

DELETE /api/carts/:cid/products/:pid

DELETE /api/carts/:cid

🧪 Testing

Los endpoints fueron probados utilizando Thunder Client, verificando:

Creación y consulta de productos

Manejo de carritos

Actualización de cantidades

Eliminación de productos

Persistencia correcta en MongoDB

✅ Estado del proyecto

Proyecto finalizado y funcional según los requerimientos de la entrega final.


Con eso el README queda **completo**.

---

## ⚠️ 2️⃣ Cambio OBLIGATORIO (muy importante)

Tenés esta línea:

```md
git clone https://github.com/Micaelarombola/backendI-FINAL