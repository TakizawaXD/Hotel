# Roomwise - Plataforma de Reserva de Habitaciones

Roomwise es una aplicación web full-stack diseñada para simplificar la búsqueda y reserva de habitaciones de hotel. El proyecto cuenta con una API RESTful robusta construida con Python/Flask y un frontend moderno e interactivo desarrollado con React.

## ✨ Características Principales

- **Autenticación de Usuarios Segura:** Sistema completo de registro e inicio de sesión utilizando tokens JWT (JSON Web Tokens) para una gestión de sesiones segura y moderna.
- **Perfiles de Usuario:** Los usuarios pueden ver su información una vez que han iniciado sesión.
- **Arquitectura Escalable:** El backend utiliza Blueprints de Flask para una organización modular del código, facilitando el mantenimiento y la expansión.
- **Base de Datos con Migraciones:** Uso de Flask-Migrate para gestionar los cambios en el esquema de la base de datos de manera controlada y versionada.
- **Preparado para Despliegue:** El proyecto está configurado con Gunicorn, listo para ser desplegado en cualquier plataforma de hosting compatible con Python (PaaS) como Render o Google Cloud Run.

## 🛠️ Stack Tecnológico

**Backend (API):**
- **Lenguaje:** Python 3.9
- **Framework:** Flask
- **Base de Datos:** SQLite (para desarrollo)
- **ORM:** Flask-SQLAlchemy
- **Migraciones:** Flask-Migrate
- **Seguridad:** Flask-Bcrypt (para hashing de contraseñas), PyJWT (para tokens)
- **Servidor WSGI:** Gunicorn

**Frontend (Cliente):**
- **Librería:** React
- **Bundler:** Vite
- **Lenguaje:** JavaScript (JSX)
- **Estilos:** CSS estándar

## 🚀 Instalación y Ejecución en Local

Para ejecutar este proyecto en tu máquina local, necesitarás tener instalado **Python 3.9+**, **Node.js** y **npm**.

### 1. Configuración del Backend

Abre una terminal y sigue estos pasos:

```bash
# 1. Clona el repositorio y navega a la carpeta del backend
# git clone <URL_DEL_REPOSITORIO>
cd roomwise/backend

# 2. Crea y activa un entorno virtual
python -m venv .venv
source .venv/bin/activate  # En Windows usa: .venv\Scripts\activate

# 3. Instala todas las dependencias de Python
pip install -r requirements.txt

# 4. Aplica las migraciones a la base de datos para crear las tablas
flask db upgrade

# 5. Inicia el servidor de la API
python run.py
```
¡Listo! Tu API estará funcionando en `http://localhost:5000`.

### 2. Configuración del Frontend

Abre una **segunda terminal** y sigue estos pasos:

```bash
# 1. Navega a la carpeta del frontend
cd roomwise/frontend

# 2. Instala todas las dependencias de Node.js
npm install

# 3. Inicia la aplicación de React
npm run dev
```
La aplicación se abrirá automáticamente en tu navegador, normalmente en `http://localhost:5173`. Ya puedes registrar un usuario, iniciar sesión y probar la funcionalidad.

## ☁️ Despliegue

El proyecto está preparado para un despliegue sencillo en la nube.

1.  **Backend:** Despliega la carpeta `backend` en un servicio como **Render**, **PythonAnywhere** o **Google Cloud Run**.
    -   **Comando de Inicio:** `gunicorn run:app`
2.  **Frontend:** Despliega la carpeta `frontend` en una plataforma de sitios estáticos como **Vercel** o **Netlify**.
3.  **Configuración Final:** Una vez desplegado el backend, obtendrás una URL pública. Debes actualizar la variable `baseURL` en el archivo `frontend/src/services/api.js` para que apunte a la nueva URL de tu API.

## 🗺️ Hoja de Ruta (Futuras Mejoras)

- **Panel de Administración:**
    - Crear una interfaz protegida para que los administradores gestionen habitaciones y reservas.
- **Reseñas y Calificaciones:**
    - Permitir a los usuarios dejar reseñas y calificar las habitaciones después de su estancia.
- **Pasarela de Pagos:**
    - Integrar un servicio como Stripe o Mercado Pago para gestionar pagos reales en el proceso de reserva.
