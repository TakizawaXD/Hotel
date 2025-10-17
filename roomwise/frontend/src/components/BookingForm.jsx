import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';

// Estilo para el contenedor del modal
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const BookingModal = ({ room, open, onClose, onSuccess }) => {
  const [checkinDate, setCheckinDate] = useState('');
  const [checkoutDate, setCheckoutDate] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Reiniciar el estado cuando el modal se cierra o la habitación cambia
  useEffect(() => {
    if (open) {
      setError(null);
      setCheckinDate('');
      setCheckoutDate('');
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!checkinDate || !checkoutDate) {
      setError('Por favor, selecciona ambas fechas.');
      return;
    }
    if (new Date(checkinDate) >= new Date(checkoutDate)) {
      setError('La fecha de check-out debe ser posterior a la de check-in.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          habitacion_id: room.id,
          cliente_id: 1, // Placeholder: Debería venir de un sistema de autenticación
          fecha_checkin: checkinDate,
          fecha_checkout: checkoutDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear la reserva.');
      }

      setSnackbarOpen(true);
      onSuccess(data); // Llama al callback de éxito

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  
  // No renderizar nada si no hay habitación seleccionada
  if (!room) {
    return null;
  }

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="booking-modal-title"
        aria-describedby="booking-modal-description"
      >
        <Box sx={style}>
          <Typography id="booking-modal-title" variant="h6" component="h2">
            Reservar Habitación {room.numero}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
            {room.tipo} - ${room.precio}/noche
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <TextField
              label="Fecha de Check-in"
              type="date"
              fullWidth
              value={checkinDate}
              onChange={(e) => setCheckinDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Fecha de Check-out"
              type="date"
              fullWidth
              value={checkoutDate}
              onChange={(e) => setCheckoutDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
              <Button onClick={onClose} color="secondary">
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Confirmar Reserva'}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          ¡Reserva creada con éxito!
        </Alert>
      </Snackbar>
    </>
  );
};

export default BookingModal;
