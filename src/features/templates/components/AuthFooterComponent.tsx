import { AuthFooterComponent as AuthFooterComponentType } from '@/models/templates';
import { Box, TextField, Typography } from '@mui/material';

interface AuthFooterComponentProps {
    component: AuthFooterComponentType;
    onChange: (component: AuthFooterComponentType) => void;
}

export default function AuthFooterComponent({ component, onChange }: AuthFooterComponentProps) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">Authentication Footer</Typography>
            
            <TextField
                label="Code Expiration (Minutes)"
                type="number"
                value={component.code_expiration_minutes || ''}
                onChange={(e) => onChange({ ...component, code_expiration_minutes: parseInt(e.target.value) || 0 })}
                fullWidth
                size="small"
                helperText="Time until the code expires"
                InputProps={{ inputProps: { min: 1 } }}
            />
        </Box>
    );
}
