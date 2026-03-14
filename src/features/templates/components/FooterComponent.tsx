import { FooterComponent as FooterComponentType } from '@/models/templates';
import { Box, TextField, Typography } from '@mui/material';

interface FooterComponentProps {
    component: FooterComponentType;
    onChange: (component: FooterComponentType) => void;
}

export default function FooterComponent({ component, onChange }: FooterComponentProps) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">Footer</Typography>
            
            <TextField
                label="Footer Text"
                value={component.text}
                onChange={(e) => onChange({ ...component, text: e.target.value })}
                fullWidth
                size="small"
                helperText="Optional footer text"
            />
        </Box>
    );
}
