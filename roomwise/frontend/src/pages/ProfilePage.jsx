import React from 'react';

const ProfilePage = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        return (
            <div>
                <h2>Perfil de Usuario</h2>
                <p>No se encontraron datos de usuario. Por favor, inicie sesión de nuevo.</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Perfil de Usuario</h2>
            <div style={{ lineHeight: '1.8' }}>
                <p><strong>Nombre de Usuario:</strong> {user.nombre_usuario}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Cédula:</strong> {user.cedula}</p>
                <p><strong>Dirección:</strong> {user.direccion || 'No especificada'}</p>
                <p><strong>País:</strong> {user.pais || 'No especificado'}</p>
                <p><strong>Fecha de Nacimiento:</strong> {user.fecha_nacimiento || 'No especificada'}</p>
            </div>
        </div>
    );
};

export default ProfilePage;
