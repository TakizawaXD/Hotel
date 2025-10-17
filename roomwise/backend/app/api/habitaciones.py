from flask import Blueprint, jsonify, request
from .. import db
from ..models import Habitacion, Reserva
from sqlalchemy import and_
from datetime import datetime

habitaciones_bp = Blueprint('habitaciones_bp', __name__)

@habitaciones_bp.route('/habitaciones', methods=['GET'])
def get_habitaciones():
    """
    Devuelve una lista de habitaciones. Si se proporcionan `fecha_checkin` y 
    `fecha_checkout` como parámetros, devuelve solo las habitaciones disponibles 
    en ese rango de fechas. De lo contrario, devuelve todas las habitaciones.
    """
    try:
        fecha_checkin_str = request.args.get('fecha_checkin')
        fecha_checkout_str = request.args.get('fecha_checkout')

        if fecha_checkin_str and fecha_checkout_str:
            # Si se proporcionan fechas, filtramos las habitaciones disponibles
            try:
                fecha_checkin = datetime.strptime(fecha_checkin_str, '%Y-%m-%d').date()
                fecha_checkout = datetime.strptime(fecha_checkout_str, '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'message': 'Formato de fecha inválido. Use YYYY-MM-DD'}), 400

            if fecha_checkin >= fecha_checkout:
                return jsonify({'message': 'La fecha de check-out debe ser posterior a la de check-in'}), 400

            # Subconsulta para encontrar los IDs de las habitaciones que están ocupadas
            # en el rango de fechas especificado.
            booked_rooms_subquery = db.session.query(Reserva.habitacion_id).filter(
                Reserva.estado != 'Cancelada',
                and_(
                    Reserva.fecha_checkin < fecha_checkout, 
                    Reserva.fecha_checkout > fecha_checkin
                )
            ).distinct()

            # Consulta principal para obtener las habitaciones cuyo ID no está en la subconsulta
            habitaciones = Habitacion.query.filter(
                Habitacion.id.notin_(booked_rooms_subquery)
            ).order_by(Habitacion.numero).all()
        else:
            # Si no se proporcionan fechas, simplemente devolvemos todas las habitaciones
            habitaciones = Habitacion.query.order_by(Habitacion.numero).all()

        return jsonify([habitacion.to_dict() for habitacion in habitaciones])

    except Exception as e:
        return jsonify({'message': f'Error interno del servidor: {e}'}), 500

# ... (el resto de las rutas POST, PUT, DELETE permanecen sin cambios)

@habitaciones_bp.route('/habitaciones', methods=['POST'])
def create_habitacion():
    data = request.get_json()
    if not data or 'numero' not in data or 'tipo' not in data or 'precio' not in data:
        return jsonify({'message': 'Datos incompletos para crear la habitación'}), 400

    nueva_habitacion = Habitacion(
        numero=data['numero'], 
        tipo=data['tipo'], 
        precio=data['precio'], 
        estado=data.get('estado', 'Disponible'),
        imagen_url=data.get('imagen_url', '')
    )
    db.session.add(nueva_habitacion)
    db.session.commit()
    return jsonify(nueva_habitacion.to_dict()), 201

@habitaciones_bp.route('/habitaciones/<int:id>', methods=['PUT'])
def update_habitacion(id):
    habitacion = Habitacion.query.get_or_404(id)
    data = request.get_json()
    
    habitacion.numero = data.get('numero', habitacion.numero)
    habitacion.tipo = data.get('tipo', habitacion.tipo)
    habitacion.precio = data.get('precio', habitacion.precio)
    habitacion.estado = data.get('estado', habitacion.estado)
    habitacion.imagen_url = data.get('imagen_url', habitacion.imagen_url)
    
    db.session.commit()
    return jsonify(habitacion.to_dict())

@habitaciones_bp.route('/habitaciones/<int:id>', methods=['DELETE'])
def delete_habitacion(id):
    habitacion = Habitacion.query.get_or_404(id)
    db.session.delete(habitacion)
    db.session.commit()
    return '', 204
