import jwt
import datetime
from flask import Blueprint, request, jsonify, current_app
from ..models import Usuario, db

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/auth/register', methods=['POST'])
def register():
    """Registra un nuevo usuario."""
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password') or not data.get('nombre_usuario') or not data.get('cedula'):
        return jsonify({'error': 'Nombre de usuario, email, cédula y contraseña son obligatorios'}), 400

    if Usuario.query.filter_by(email=data.get('email')).first():
        return jsonify({'error': 'El email ya está registrado'}), 409

    if Usuario.query.filter_by(nombre_usuario=data.get('nombre_usuario')).first():
        return jsonify({'error': 'El nombre de usuario ya está en uso'}), 409
    
    if Usuario.query.filter_by(cedula=data.get('cedula')).first():
        return jsonify({'error': 'La cédula ya está registrada'}), 409

    nuevo_usuario = Usuario(
        nombre_usuario=data.get('nombre_usuario'),
        email=data.get('email'),
        cedula=data.get('cedula'),
        direccion=data.get('direccion'),
        pais=data.get('pais'),
        fecha_nacimiento=data.get('fecha_nacimiento') 
    )
    nuevo_usuario.set_password(data.get('password'))

    db.session.add(nuevo_usuario)
    db.session.commit()

    return jsonify(nuevo_usuario.to_dict()), 201

@auth_bp.route('/auth/login', methods=['POST'])
def login():
    """Inicia sesión y devuelve un token JWT."""
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email y contraseña son obligatorios'}), 400

    usuario = Usuario.query.filter_by(email=data.get('email')).first()

    if not usuario or not usuario.check_password(data.get('password')):
        return jsonify({'error': 'Credenciales inválidas'}), 401

    # Generar el token JWT
    token = jwt.encode({
        'user_id': usuario.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24) # Expiración en 24 horas
    }, current_app.config['SECRET_KEY'], algorithm="HS256")

    return jsonify({
        'message': 'Inicio de sesión exitoso',
        'token': token,
        'user': usuario.to_dict()
    })
