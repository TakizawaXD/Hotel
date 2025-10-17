from flask import Blueprint, jsonify, request
from .. import db
from ..models import Cliente

clientes_bp = Blueprint('clientes_bp', __name__)

@clientes_bp.route('/api/clients', methods=['GET'])
def get_clients():
    clients = Cliente.query.all()
    return jsonify([{'id': client.id, 'nombre': client.nombre, 'email': client.email, 'telefono': client.telefono} for client in clients])

@clientes_bp.route('/api/clients', methods=['POST'])
def create_client():
    data = request.get_json()
    new_client = Cliente(nombre=data['nombre'], email=data['email'], telefono=data.get('telefono'))
    db.session.add(new_client)
    db.session.commit()
    return jsonify({'message': 'Cliente creado'}), 201

@clientes_bp.route('/api/clients/<int:id>', methods=['PUT'])
def update_client(id):
    client = Cliente.query.get_or_404(id)
    data = request.get_json()
    client.nombre = data.get('nombre', client.nombre)
    client.email = data.get('email', client.email)
    client.telefono = data.get('telefono', client.telefono)
    db.session.commit()
    return jsonify({'message': 'Cliente actualizado'})

@clientes_bp.route('/api/clients/<int:id>', methods=['DELETE'])
def delete_client(id):
    client = Cliente.query.get_or_404(id)
    db.session.delete(client)
    db.session.commit()
    return jsonify({'message': 'Cliente eliminado'})
