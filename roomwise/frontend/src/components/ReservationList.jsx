import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Box,
  Alert,
  Button,
  Chip
} from '@mui/material';

// Función para dar formato a la fecha
const formatDate = (dateString) => {
  const date = new Date(dateString);
  // Se suma un día porque al crear la fecha desde un string YYYY-MM-DD, a veces toma el día anterior por UTC
  date.setDate(date.getDate() + 1);
  return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
};

// Función para dar formato a la moneda
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Función para calcular la diferencia de días
const calculateNights = (checkin, checkout) => {
    const startDate = new Date(checkin);
    const endDate = new Date(checkout);
    const timeDiff = endDate.getTime() - startDate.getTime();
    const nightCount = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return nightCount > 0 ? nightCount : 1;
};

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reservas');
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.statusText}`);
      }
      const data = await response.json();
      setReservations(data);
    } catch (err) {
      setError(`No se pudieron cargar las reservas. Detalle: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleDelete = async (reservationId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
      try {
        const response = await fetch(`/api/reservas/${reservationId}`, { method: 'DELETE' });
        if (!response.ok) {
          throw new Error('No se pudo eliminar la reserva.');
        }
        // Actualizamos la lista de reservas en el estado para reflejar el cambio
        setReservations(reservations.filter(r => r.id !== reservationId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>;
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Typography variant="h4" component="h1" sx={{ p: 2 }}>
        Historial de Reservas
      </Typography>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="tabla de reservas">
          <TableHead>
            <TableRow>
              <TableCell>Huésped</TableCell>
              <TableCell>Habitación</TableCell>
              <TableCell>Fechas Estancia</TableCell>
              <TableCell align="center">Noches</TableCell>
              <TableCell align="right">Monto Total</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.length > 0 ? reservations.map((reserva) => {
              const nights = calculateNights(reserva.fecha_checkin, reserva.fecha_checkout);
              const totalAmount = nights * (reserva.habitacion?.precio || 0);

              return (
                <TableRow hover key={reserva.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">{reserva.cliente?.nombre}</Typography>
                    <Typography variant="caption" color="text.secondary">{reserva.cliente?.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">N° {reserva.habitacion?.numero}</Typography>
                    <Typography variant="caption" color="text.secondary">{reserva.habitacion?.tipo}</Typography>
                  </TableCell>
                  <TableCell>
                    {formatDate(reserva.fecha_checkin)} - {formatDate(reserva.fecha_checkout)}
                  </TableCell>
                  <TableCell align="center">{nights}</TableCell>
                  <TableCell align="right">{formatCurrency(totalAmount)}</TableCell>
                  <TableCell align="center">
                    <Chip label={reserva.estado} color={reserva.estado === 'Confirmada' ? 'success' : 'default'} size="small"/>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      color="error"
                      size="small"
                      onClick={() => handleDelete(reserva.id)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              );
            }) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography sx={{ p: 4, color: 'text.secondary' }}>No hay reservas para mostrar.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ReservationList;
