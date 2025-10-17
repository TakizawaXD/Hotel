from . import db
from werkzeug.security import generate_password_hash, check_password_hash

# Modelo Habitacion
class Habitacion(db.Model):
    __tablename__ = 'habitacion'
    id = db.Column(db.Integer, primary_key=True)
    numero = db.Column(db.String(10), unique=True, nullable=False)
    tipo = db.Column(db.String(50), nullable=False)
    precio = db.Column(db.Float, nullable=False)
    estado = db.Column(db.String(20), nullable=False, default='Disponible')
    imagen_url = db.Column(db.String(255), default='/images/default-room.jpg')
    reservas = db.relationship('Reserva', back_populates='habitacion', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'numero': self.numero,
            'tipo': self.tipo,
            'precio': self.precio,
            'estado': self.estado,
            'imagen_url': self.imagen_url
        }

# Modelo Cliente
class Cliente(db.Model):
    __tablename__ = 'cliente'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    telefono = db.Column(db.String(20))
    reservas = db.relationship('Reserva', back_populates='cliente', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'email': self.email,
            'telefono': self.telefono
        }

# Modelo Reserva
class Reserva(db.Model):
    __tablename__ = 'reserva'
    id = db.Column(db.Integer, primary_key=True)
    habitacion_id = db.Column(db.Integer, db.ForeignKey('habitacion.id'), nullable=False)
    cliente_id = db.Column(db.Integer, db.ForeignKey('cliente.id'), nullable=False)
    fecha_checkin = db.Column(db.Date, nullable=False)
    fecha_checkout = db.Column(db.Date, nullable=False)
    estado = db.Column(db.String(20), nullable=False, default='Confirmada')
    habitacion = db.relationship('Habitacion', back_populates='reservas')
    cliente = db.relationship('Cliente', back_populates='reservas')

    def to_dict(self):
        return {
            'id': self.id,
            'fecha_checkin': self.fecha_checkin.isoformat(),
            'fecha_checkout': self.fecha_checkout.isoformat(),
            'estado': self.estado,
            'habitacion': self.habitacion.to_dict() if self.habitacion else None,
            'cliente': self.cliente.to_dict() if self.cliente else None
        }

# Modelo Usuario
class Usuario(db.Model):
    __tablename__ = 'usuario'
    id = db.Column(db.Integer, primary_key=True)
    nombre_usuario = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    cedula = db.Column(db.String(20), unique=True, nullable=False)
    direccion = db.Column(db.String(200))
    pais = db.Column(db.String(50))
    fecha_nacimiento = db.Column(db.Date)

    def set_password(self, password):
        """Crea un hash de la contraseña."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Verifica la contraseña contra el hash."""
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        """Convierte el objeto Usuario a un diccionario, excluyendo la contraseña."""
        return {
            'id': self.id,
            'nombre_usuario': self.nombre_usuario,
            'email': self.email,
            'cedula': self.cedula,
            'direccion': self.direccion,
            'pais': self.pais,
            'fecha_nacimiento': self.fecha_nacimiento.isoformat() if self.fecha_nacimiento else None,
        }
