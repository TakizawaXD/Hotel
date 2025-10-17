from flask import Blueprint, jsonify, request
from .. import db
from ..models import Reserva, Habitacion, Cliente
from datetime import datetime
from sqlalchemy.orm import joinedload
from sqlalchemy import and_

reservas_bp = Blueprint('reservas_bp', __name__)

@reservas_bp.route('/reservas', methods=['GET'])
def get_reservas():
    try:
        reservas = Reserva.query.options(
            joinedload(Reserva.habitacion),
            joinedload(Reserva.cliente)
        ).order_by(Reserva.fecha_checkin.desc()).all()
        return jsonify([reserva.to_dict() for reserva in reservas])
    except Exception as e:
        return jsonify({'message': f'Error interno del servidor: {e}'}), 500

@reservas_bp.route('/reservas', methods=['POST'])
def create_reserva():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No se recibieron datos'}), 400

    try:
        habitacion_id = data['habitacion_id']
        cliente_data = data['cliente'] # Objeto con datos del cliente
        fecha_checkin = datetime.strptime(data['fecha_checkin'], '%Y-%m-%d').date()
        fecha_checkout = datetime.strptime(data['fecha_checkout'], '%Y-%m-%d').date()
    except (KeyError, TypeError, ValueError) as e:
        return jsonify({'message': f'Dato inválido o faltante en la petición: {e}'}), 400

    if fecha_checkin >= fecha_checkout:
        return jsonify({'message': 'La fecha de check-out debe ser posterior a la de check-in'}), 400

    # 1. Validar disponibilidad de la habitación
    conflicting_reserva = Reserva.query.filter(
        Reserva.habitacion_id == habitacion_id,
        Reserva.estado != 'Cancelada',
        and_(Reserva.fecha_checkin < fecha_checkout, Reserva.fecha_checkout > fecha_checkin)
    ).first()

    if conflicting_reserva:
        return jsonify({'message': 'La habitación ya está reservada para las fechas seleccionadas'}), 409

    # 2. Buscar o crear el cliente
    try:
        cliente_email = cliente_data['email']
        cliente = Cliente.query.filter_by(email=cliente_email).first()

        if not cliente:
            # Cliente no existe, lo creamos
            cliente = Cliente(
                nombre=cliente_data['nombre'],
                email=cliente_email,
                telefono=cliente_data.get('telefono')
            )
            db.session.add(cliente)
            # Hacemos un flush para obtener el ID del nuevo cliente antes del commit final
            db.session.flush()

    except KeyError:
        return jsonify({'message': 'El email del cliente es obligatorio'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error al procesar el cliente: {e}'}), 500

    # 3. Crear la reserva
    try:
        nueva_reserva = Reserva(
            habitacion_id=habitacion_id,
            cliente_id=cliente.id, # Usamos el ID del cliente encontrado o recién creado
            fecha_checkin=fecha_checkin,
            fecha_checkout=fecha_checkout,
            estado=data.get('estado', 'Confirmada')
        )
        db.session.add(nueva_reserva)
        db.session.commit()
        
        # Devolvemos la reserva completa
        return jsonify(nueva_reserva.to_dict()), 201

    except Exception as e:
        db.session.rollback() # Revertimos la transacción si algo sale mal
        return jsonify({'message': f'Error al crear la reserva: {e}'}), 500


@reservas_bp.route('/reservas/<int:id>', methods=['DELETE'])
def delete_reserva(id):
    reserva = Reserva.query.get_or_404(id)
    try:
        db.session.delete(reserva)
        db.session.commit()
        return jsonify({'message': 'Reserva eliminada exitosamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error al eliminar la reserva: {e}'}), 500
