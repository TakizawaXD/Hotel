import sqlite3
import os

# --- Configuración Dinámica ---

def find_project_root(current_path, marker_file='.idx/dev.nix'):
    """Encuentra el directorio raíz del proyecto buscando un archivo marcador."""
    path = os.path.abspath(current_path)
    while path != os.path.dirname(path): # Mientras no lleguemos a la raíz del sistema
        if os.path.exists(os.path.join(path, marker_file)):
            return path
        path = os.path.dirname(path)
    return None # Marcador no encontrado

# Encontrar la raíz del proyecto y construir las rutas
project_root = find_project_root(__file__)
if not project_root:
    print("Error: No se pudo encontrar la raíz del proyecto.")
    exit()

DB_PATH = os.path.join(project_root, 'roomwise', 'backend', 'instance', 'database.db')
SQL_FILE_PATH = os.path.join(project_root, 'basededatos.sql')

# --- Lógica del Script ---

def seed_database():
    """Lee un archivo .sql y ejecuta sus comandos en la base de datos."""
    if not os.path.exists(DB_PATH):
        print(f"Error: La base de datos no se encontró en '{DB_PATH}'.")
        print("Asegúrate de que la aplicación Flask se haya ejecutado al menos una vez.")
        return

    if not os.path.exists(SQL_FILE_PATH):
        print(f"Error: El archivo SQL no se encontró en '{SQL_FILE_PATH}'.")
        return

    print(f"Conectando a la base de datos: {DB_PATH}")
    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        print(f"Leyendo el archivo SQL: {SQL_FILE_PATH}")
        with open(SQL_FILE_PATH, 'r') as sql_file:
            sql_script = sql_file.read()
            cursor.executescript(sql_script)
        
        conn.commit()
        print("¡Éxito! La base de datos ha sido poblada con los datos de prueba.")

    except sqlite3.Error as e:
        print(f"Ocurrió un error de SQLite: {e}")
        if conn:
            conn.rollback()

    finally:
        if conn:
            conn.close()
            print("Conexión a la base de datos cerrada.")

if __name__ == '__main__':
    seed_database()
