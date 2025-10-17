import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import es from 'date-fns/locale/es'; // Importar el idioma español

// Función para dar formato a la moneda
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const ReservationModal = ({ open, onClose, room, onConfirm }) => {
  // Estado para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fechaCheckin, setFechaCheckin] = useState(null);
  const [fechaCheckout, setFechaCheckout] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  // Calcular el precio total cuando cambian las fechas
  useEffect(() => {
    if (fechaCheckin && fechaCheckout && room.precio) {
      const oneDay = 24 * 60 * 60 * 1000; // Milisegundos en un día
      const diffDays = Math.round(Math.abs((fechaCheckout - fechaCheckin) / oneDay));
      if (diffDays > 0) {
        setTotalPrice(diffDays * room.precio);
      }
    } else {
      setTotalPrice(0);
    }
  }, [fechaCheckin, fechaCheckout, room.precio]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const reservationData = {
      habitacion_id: room.id,
      cliente: { nombre, email, telefono }, // Anidamos los datos del cliente
      fecha_checkin: fechaCheckin.toISOString().split('T')[0], // Formato YYYY-MM-DD
      fecha_checkout: fechaCheckout.toISOString().split('T')[0], // Formato YYYY-MM-DD
      estado: 'Confirmada'
    };
    onConfirm(reservationData);
  };
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Reservar Habitación {room.numero}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Typography variant="h6" gutterBottom>{room.tipo}</Typography>
            <Typography variant="body1" color="primary" gutterBottom>
              {formatCurrency(room.precio)} / noche
            </Typography>
            
            <Box sx={{ my: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Tus Datos</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Nombre Completo"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    type="email"
                    label="Correo Electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Teléfono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ my: 3 }}>
                <Typography variant="subtitle1" gutterBottom>Fechas de la Estancia</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <DatePicker
                            label="Fecha de Check-in"
                            value={fechaCheckin}
                            onChange={setFechaCheckin}
                            disablePast
                            slotProps={{ textField: { required: true, fullWidth: true } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <DatePicker
                            label="Fecha de Check-out"
                            value={fechaCheckout}
                            onChange={setFechaCheckout}
                            minDate={fechaCheckin ? new Date(fechaCheckin.getTime() + 86400000) : undefined}
                            disablePast
                            slotProps={{ textField: { required: true, fullWidth: true } }}
                        />
                    </Grid>
                </Grid>
            </Box>

            {totalPrice > 0 && (
              <Typography variant="h5" align="center" sx={{ mt: 3 }}>
                Precio Total: {formatCurrency(totalPrice)}
              </Typography>
            )}

          </DialogContent>
          <DialogActions sx={{ p: '16px 24px' }}>
            <Button onClick={onClose}>Cancelar</Button>
            <Button type="submit" variant="contained">
              Confirmar Reserva
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
};

export default ReservationModal;
