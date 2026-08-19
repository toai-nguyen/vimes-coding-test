import {
    Box,
    TextField,
} from '@mui/material';

interface CustomTextFieldProps {
    label: string;
    name?: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error?: boolean;
    helperText?: string;
    placeholder?: string;
    type?: string;
    disabled?: boolean;
}

function CustomTextField({
    label,
    name,
    value,
    onChange,
    error = false,
    helperText = '',
    placeholder = '',
    type = 'text',
    disabled = false
}: CustomTextFieldProps) {
    return (
        <Box>
            <label
                style={{ fontWeight: 600, marginBottom: '0.25rem', display: 'block' }}
            >{label}</label>
            <TextField
                fullWidth
                name={name}
                value={value}
                onChange={onChange}
                error={error}
                helperText={helperText}
                placeholder={placeholder}
                type={type}
                disabled={disabled}
                size="small"
                variant='outlined'
                hiddenLabel
            />
        </Box>
    )
}

export default CustomTextField;
