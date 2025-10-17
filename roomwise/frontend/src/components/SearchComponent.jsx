import React, { useState } from 'react';
import {
  Paper,
  Grid,
  Button,
  Box
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import es from 'date-fns/locale/es';

const SearchComponent = ({ onSearch, loading }) => {
  const [checkinDate, setCheckinDate] = useState(null);
  const [checkoutDate, setCheckoutDate] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = () => {
    if (!checkinDate || !checkoutDate) {
      setError('Por favor, selecciona ambas fechas.');
      return;
    }
    if (checkinDate >= checkoutDate) {
        setError('La fecha de check-out debe ser posterior a la de check-in.');
        return;
    }
    setError(null);
    onSearch(checkinDate, checkoutDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={5}>
            <DatePicker
              label="Fecha de Check-in"
              value={checkinDate}
              onChange={setCheckinDate}
              disablePast
              slotProps={{ textField: { fullWidth: true, error: !!error } }}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <DatePicker
              label="Fecha de Check-out"
              value={checkoutDate}
              onChange={setCheckoutDate}
              minDate={checkinDate ? new Date(checkinDate.getTime() + 86400000) : undefined}
              disablePast
              slotProps={{ textField: { fullWidth: true, error: !!error, helperText: error } }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Box sx={{ display: 'flex', height: '100%' }}>
              <Button 
                variant="contained"
                fullWidth 
                onClick={handleSearch}
                disabled={loading}
                sx={{ height: '100%', minHeight: '56px' }}
              >
                Buscar
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </LocalizationProvider>
  );
};

export default SearchComponent;
