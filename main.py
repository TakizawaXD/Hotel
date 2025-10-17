# Este fichero es el punto de entrada para el servidor de desarrollo.

from roomwise.backend.app import create_app

# Crear la instancia de la aplicación Flask usando la factory
app = create_app()

if __name__ == "__main__":
    # Ejecutar la aplicación
    # El puerto 5000 es el que espera el proxy de Vite
    app.run(host='0.0.0.0', port=5000, debug=True)
