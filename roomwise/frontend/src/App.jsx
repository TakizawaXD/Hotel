import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  NavLink,
  useNavigate
} from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  CssBaseline,
  Snackbar,
  Alert,
  Button
} from '@mui/material';

// Páginas
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

// Componentes
import RoomList from './components/RoomList';
import ReservationList from './components/ReservationList';
import ReservationModal from './components/ReservationModal';
import SearchComponent from './components/SearchComponent';

const formatDateForApi = (date) => {
  return date.toISOString().split('T')[0];
};

const AppContent = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
    window.location.reload();
  };

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async (checkinDate = null, checkoutDate = null) => {
    setLoading(true);
    setError(null);
    let url = 'http://localhost:5000/api/habitaciones';

    if (checkinDate && checkoutDate) {
      url += `?fecha_checkin=${formatDateForApi(checkinDate)}&fecha_checkout=${formatDateForApi(checkoutDate)}`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al buscar habitaciones.');
      }
      const data = await response.json();
      setRooms(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (checkin, checkout) => {
    fetchRooms(checkin, checkout);
  };
  
  const handleReserveClick = (room) => {
    if (!user) {
      setNotification({ open: true, message: 'Debes iniciar sesión para reservar', severity: 'warning' });
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
  };
  
  const handleConfirmReservation = async (reservationData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/reservas', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(reservationData),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Error al confirmar la reserva');
      }

      handleCloseModal();
      setNotification({ open: true, message: '¡Reserva confirmada con éxito! Redirigiendo...', severity: 'success' });
      
      setTimeout(() => {
        navigate('/reservas');
      }, 2000);

    } catch (err) {
      setNotification({ open: true, message: err.message, severity: 'error' });
    }
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') return;
    setNotification({ ...notification, open: false });
  };

  const activeLinkStyle = { textDecoration: 'underline', fontWeight: 'bold' };

  return (
    <>
      <CssBaseline />
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ color: 'inherit', textDecoration: 'none', flexGrow: 1 }}>
            Roomwise
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <NavLink to="/" style={({ isActive }) => ({ color: 'inherit', textDecoration: 'none', marginRight: 16, ...(isActive ? activeLinkStyle : {})})}>
              Habitaciones
            </NavLink>
            {user && (
              <NavLink to="/reservas" style={({ isActive }) => ({ color: 'inherit', textDecoration: 'none', marginRight: 16, ...(isActive ? activeLinkStyle : {})})}>
                Mis Reservas
              </NavLink>
            )}
            {user ? (
              <>
                <NavLink to="/perfil" style={({ isActive }) => ({ color: 'inherit', textDecoration: 'none', marginRight: 16, ...(isActive ? activeLinkStyle : {})})}>
                  Hola, {user.nombre_usuario}
                </NavLink>
                <Button color="inherit" onClick={handleLogout}>Cerrar Sesión</Button>
              </>
            ) : (
              <>
                <NavLink to="/login" style={({ isActive }) => ({ color: 'inherit', textDecoration: 'none', marginRight: 16, ...(isActive ? activeLinkStyle : {})})}>
                  Login
                </NavLink>
                <NavLink to="/register" style={({ isActive }) => ({ color: 'inherit', textDecoration: 'none', ...(isActive ? activeLinkStyle : {})})}>
                  Registro
                </NavLink>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      
      <Container component="main" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={
            <>
              <SearchComponent onSearch={handleSearch} loading={loading} />
              <RoomList rooms={rooms} loading={loading} error={error} onReserveClick={handleReserveClick} />
            </>
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Rutas Protegidas */}
          <Route path="/reservas" element={user ? <ReservationList /> : <LoginPage />} />
          <Route path="/perfil" element={user ? <ProfilePage /> : <LoginPage />} />
        </Routes>
      </Container>

      {selectedRoom && (
        <ReservationModal
          open={isModalOpen}
          onClose={handleCloseModal}
          room={selectedRoom}
          onConfirm={handleConfirmReservation}
        />
      )}

      <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
