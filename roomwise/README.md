# Roomwise - Plataforma de Reserva de Habitaciones

Roomwise es una aplicación web full-stack diseñada para simplificar la búsqueda y reserva de habitaciones de hotel. El proyecto cuenta con una API RESTful robusta construida con Python/Flask y un frontend moderno e interactivo desarrollado con React.

## ✨ Características Principales

-   **Autenticación de Usuarios:** Sistema completo de registro e inicio de sesión.
-   **Gestión de Perfil:** Los usuarios pueden ver y gestionar la información de su perfil.
-   **Búsqueda y Filtro de Habitaciones:** Explora las habitaciones disponibles con opciones de filtrado.
-   **Sistema de Reservas:** Realiza, consulta y gestiona reservas de habitaciones.
-   **Interfaz Interactiva:** Frontend construido con React y Material-UI para una experiencia de usuario fluida y atractiva.

## 🛠️ Stack Tecnológico

-   **Backend:** Python, Flask, SQLAlchemy
-   **Frontend:** React, Vite, Material-UI, Day.js
-   **Base de Datos:** SQLite (para desarrollo)

## 🚀 Cómo Empezar

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.

### Prerrequisitos

-   Python 3.10+
-   Node.js 18.x+ y npm
-   Git

### Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/TakizawaXD/Hotel.git
    cd Hotel/roomwise
    ```

2.  **Configura el Backend:**
    ```bash
    # Navega al directorio del backend
    cd backend

    # Crea y activa un entorno virtual
    python -m venv .venv
    source .venv/bin/activate

    # Instala las dependencias
    pip install -r requirements.txt
    ```

3.  **Configura el Frontend:**
    ```bash
    # Navega al directorio del frontend
    cd ../frontend

    # Instala las dependencias de npm
    npm install
    ```

### Ejecución

1.  **Inicia el servidor del Backend:**
    *   Asegúrate de estar en el directorio `backend` y de que el entorno virtual esté activado.
    *   Ejecuta la aplicación Flask:
        ```bash
        flask run
        ```
    *   La API estará disponible en `http://127.0.0.1:5000`.

2.  **Inicia la aplicación del Frontend:**
    *   Abre una nueva terminal y navega al directorio `frontend`.
    *   Ejecuta la aplicación de React:
        ```bash
        npm run dev
        ```
    *   Abre tu navegador y visita `http://127.0.0.1:5173`.

## 🔮 Futuras Características (Roadmap)

-   **Añadir Reseñas y Calificaciones:**
    -   Permitir a los usuarios publicar reseñas después de su estancia.
    -   Mostrar una calificación promedio para cada habitación.
-   **Integrar una Pasarela de Pagos:**
    -   Integrar un proveedor como Stripe o Mercado Pago para procesar pagos de forma segura.
    -   Actualizar el flujo de reserva para incluir el pago.
-   **Notificaciones por Correo Electrónico:**
    -   Enviar confirmaciones de reserva y recordatorios por correo electrónico.