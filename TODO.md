# Lista de Tareas del Proyecto Roomwise

A continuación se detallan las próximas funcionalidades sugeridas para mejorar la aplicación.

### 1. Implementar Autenticación de Usuarios

- [ ] **Crear modelos de Usuario y Roles:** Añadir `User` y `Role` a la base de datos para gestionar el acceso.
- [ ] **Desarrollar endpoints de registro e inicio de sesión:** Crear las rutas en Flask (`/api/auth/register`, `/api/auth/login`) para manejar la creación de usuarios y la autenticación con JWT (JSON Web Tokens).
- [ ] **Proteger rutas del backend:** Asegurar que solo los usuarios autenticados (y con los roles correctos) puedan acceder a ciertas rutas, como la creación de reservas o la administración.
- [ ] **Crear vistas de registro e inicio de sesión en el frontend:** Desarrollar los formularios en React para que los usuarios puedan registrarse e iniciar sesión.
- [ ] **Gestionar el estado de autenticación global en React:** Usar Context API o una librería de estado para saber en todo momento si el usuario ha iniciado sesión.
- [ ] **Actualizar la página "Mis Reservas":** Filtrar las reservas para que cada usuario vea únicamente las suyas.

### 2. Crear un Panel de Administración

- [ ] **Diseñar una nueva sección de Admin:** Crear un nuevo Blueprint en Flask y componentes de React para el panel.
- [ ] **Proteger el panel:** Asegurar que solo los usuarios con rol de `administrador` puedan acceder.
- [ ] **CRUD de Habitaciones:** Desarrollar una interfaz donde el administrador pueda **C**rear, **L**eer, **A**ctualizar y **E**liminar habitaciones sin tocar la base de datos directamente.
- [ ] **Dashboard de Reservas:** Mostrar una vista general de todas las reservas, con la capacidad de filtrarlas o cancelarlas.

### 3. Añadir Reseñas y Calificaciones

- [ ] **Crear modelo de Reseña:** Añadir una tabla `Review` a la base de datos, relacionada con `User` y `Habitacion`.
- [ ] **Desarrollar endpoint para crear reseñas:** Permitir que un usuario que haya completado una estancia pueda publicar una reseña.
- [ ] **Mostrar calificaciones en la lista de habitaciones:** Calcular la calificación promedio de cada habitación y mostrarla en las tarjetas.

### 4. Integrar una Pasarela de Pagos (Avanzado)

- [ ] **Elegir un proveedor de pagos:** Investigar e integrar un servicio como Stripe o Mercado Pago.
- [ ] **Crear endpoints para procesar pagos:** Desarrollar la lógica en el backend para iniciar una transacción y recibir la confirmación.
- [ ] **Actualizar el flujo de reserva:** Modificar el modal de reserva para incluir el paso del pago antes de confirmar la reserva.
