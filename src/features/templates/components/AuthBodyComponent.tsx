import { AuthBodyComponent as AuthBodyComponentType } from '@/models/templates';
import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material';

interface AuthBodyComponentProps {
    component: AuthBodyComponentType;
    onChange: (component: AuthBodyComponentType) => void;
}

export default function AuthBodyComponent({ component, onChange }: AuthBodyComponentProps) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">Authentication Body</Typography>
            
            <FormControlLabel
                control={
                    <Checkbox
                        checked={component.add_security_recommendation}
                        onChange={(e) => onChange({ ...component, add_security_recommendation: e.target.checked })}
                    />
                }
                label="Add Security Recommendation"
            />
            <Typography variant="caption" color="text.secondary">
                Adds standard security warning text to the message body.
            </Typography>
        </Box>
    );
}
