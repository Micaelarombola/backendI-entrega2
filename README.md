# Backend I - Coderhouse  
## Entrega Nº2: Handlebars + WebSockets + Actualización en Tiempo Real

Este proyecto implementa un servidor Express con motor de plantillas **Handlebars**, integración de **Socket.io** y actualización en tiempo real de la lista de productos.

La aplicación permite:

- Visualizar productos desde archivos JSON  
- Renderizar vistas con Handlebars  
- Crear y eliminar productos  
- Actualizar la vista automáticamente mediante WebSockets  
- Mantener persistencia en archivos dentro de `/data`

---

## 📁 Estructura del proyecto

BACKEND I/
│ app.js
│ package.json
│ README.md
│
├── data
│ ├── products.json
│ └── carts.json
│
├── public
│ └── js
│ └── realtime.js
│
└── src
├── managers
│ ├── ProductManager.js
│ └── CartManager.js
│
├── routes
│ ├── products.router.js
│ └── carts.router.js
│
└── views
├── home.handlebars
├── realTimeProducts.handlebars
└── layouts
└── main.handlebars


---

## 🚀 Instalación

2.  Instalar dependencias:
```bash
npm install

Instalar Handlebars:

npm install express-handlebars

3. Instalar Socket.io:
npm install socket.io


4. Ejecutar el servidor:

node app.js

El servidor corre en:
👉 http://localhost:8080

🖥️ Vistas del proyecto
1. Home (vista normal)

Ruta:

GET http://localhost:8080/

2. RealTimeProducts (vista con WebSockets)

Ruta:

GET http://localhost:8080/realtimeproducts

Incluye:

Lista de productos que se actualiza en tiempo real

Formulario para crear productos

Formulario para eliminar productos

Comunicación vía Socket.io

Cuando se crea o elimina un producto:

✔ Se escribe en products.json
✔ Se emite un evento WebSocket
✔ La lista se actualiza automáticamente sin recargar la página

🧠 Lógica WebSocket (Socket.io)

En app.js, el servidor emite:

products → para enviar la lista actualizada

errorMessage → para manejar errores

newProduct → para crear productos desde WebSocket

deleteProduct → para eliminar productos

El cliente escucha y modifica el DOM en:

public/js/realtime.js

📦 API REST (Primera entrega integrada)
Productos (/api/products)

✔ GET todos
✔ GET por ID
✔ POST crear
✔ PUT actualizar
✔ DELETE eliminar

Carritos (/api/carts)

✔ POST crear carrito
✔ GET ver productos del carrito
✔ POST agregar productos al carrito

Toda la persistencia se maneja mediante archivos JSON.

📝 Tecnologías utilizadas

Node.js

Express

Handlebars

Socket.io

JavaScript

JSON para persistencia

✔ Estado del proyecto

Entrega Nº2 completa y funcional.

Handlebars OK

WebSockets OK

Listas dinámicas OK

Formularios funcionando

Persistencia en JSON

Estructura limpia y ordenada

Autor

Proyecto desarrollado por Nicolás Pombo para el curso Backend I - Coderhouse.


---

# 🔥 Si querés, también te preparo:
✅ Un ZIP limpio para entregar  
✅ Un video cortito explicando cómo funciona  
✅ Una versión del README con capturas de pantalla  

¿Querés que arme el ZIP de entrega?

