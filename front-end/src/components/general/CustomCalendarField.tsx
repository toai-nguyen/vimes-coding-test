import { Box } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import type { Dayjs } from 'dayjs'

type CustomCalendarFieldProps = {
  label: string
  value: Dayjs | null
  onChange: (value: Dayjs | null) => void
  error?: boolean
  helperText?: string
  required?: boolean
}

function CustomCalendarField({
  label,
  value,
  onChange,
  error = false,
  helperText,
  required = false,
}: CustomCalendarFieldProps) {
  return (
    <Box>
      <label
        style={{ fontWeight: 600, marginBottom: '0.25rem', display: 'block' }}
      >{label}</label>
      <DatePicker
        // label={label}
        value={value}
        onChange={onChange}
        format="DD/MM/YYYY"
        slotProps={{
          textField: {
            fullWidth: true,
            required,
            error,
            helperText,
          },
        }}
      />
    </Box>

  )
}

export default CustomCalendarField
