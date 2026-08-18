import { useState } from 'react'
import { Alert, Box, Button, Stack, Typography } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import type { Dayjs } from 'dayjs'
import CustomCalendarField from './components/general/CustomCalendarField'

function App() {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const isError = submitted && !selectedDate

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          px: 2,
        }}
      >
        <Stack
          spacing={2}
          sx={{
            width: '100%',
            maxWidth: 420,
          }}
        >
          <Typography variant="h5" component="h1">
            MUI DatePicker với helperText lỗi
          </Typography>
          <CustomCalendarField
            label="Ngày sinh"
            value={selectedDate}
            onChange={setSelectedDate}
            required
            error={isError}
            helperText={
              isError
                ? 'Vui lòng chọn ngày trước khi tiếp tục.'
                : 'Chọn ngày theo định dạng DD/MM/YYYY'
            }
          />
          <Button variant="contained" onClick={() => setSubmitted(true)}>
            Kiểm tra
          </Button>
          {selectedDate && submitted && (
            <Alert severity="success">
              Ngày đã chọn: {selectedDate.format('DD/MM/YYYY')}
            </Alert>
          )}
        </Stack>
      </Box>
    </LocalizationProvider>
  )
}

export default App
