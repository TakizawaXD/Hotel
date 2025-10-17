import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  CircularProgress,
  Box,
  Alert,
  Chip
} from '@mui/material';

// Función para dar formato a la moneda
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// El componente ahora recibe las habitaciones y los estados como props
const RoomList = ({ rooms, loading, error, onReserveClick }) => {

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>;
  }

  if (rooms.length === 0) {
      return (
          <Alert severity="info" sx={{ my: 2 }}>
              No se encontraron habitaciones disponibles para las fechas seleccionadas. Por favor, intenta con otro rango de fechas.
          </Alert>
      );
  }

  return (
    <Grid container spacing={4}>
      {rooms.map((room) => (
        <Grid item xs={12} sm={6} md={4} key={room.id}>
          <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <CardMedia
              component="img"
              height="200"
              image={room.imagen_url || 'https://via.placeholder.com/300x200.png?text=Sin+Imagen'}
              alt={`Habitación ${room.numero}`}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="div">
                Habitación {room.numero}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                {room.tipo}
              </Typography>
              <Chip
                label={room.estado}
                color={room.estado === 'Disponible' ? 'success' : 'warning'}
                size="small"
                sx={{ mb: 2 }}
              />
              <Typography variant="h6" color="primary">
                {formatCurrency(room.precio)} / noche
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', paddingBottom: 2 }}>
              <Button
                variant="contained"
                onClick={() => onReserveClick(room)}
                disabled={room.estado !== 'Disponible'}
              >
                Reservar Ahora
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default RoomList;
