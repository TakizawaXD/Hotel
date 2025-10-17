# Usar una imagen base oficial de Python
FROM python:3.9-slim

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar el archivo de dependencias
COPY requirements.txt requirements.txt

# Instalar las dependencias
# --no-cache-dir reduce el tamaño de la imagen
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto del código de la aplicación al directorio de trabajo
COPY . .

# Comando para ejecutar la aplicación con Gunicorn
# Google Cloud Run inyecta la variable de entorno $PORT, que suele ser 8080.
# Le decimos a Gunicorn que escuche en todas las interfaces (0.0.0.0) en ese puerto.
# "run:app" significa: busca el archivo run.py y dentro de él, el objeto llamado app.
CMD exec gunicorn --bind 0.0.0.0:$PORT run:app
