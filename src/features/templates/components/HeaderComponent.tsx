import VariableHighlightInput from '@/features/templates/components/VariableHighlightInput';
import { HeaderComponent as HeaderComponentType } from '@/models/templates';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';

interface HeaderComponentProps {
    component: HeaderComponentType;
    onChange: (component: HeaderComponentType) => void;
    category: string;
}

export default function HeaderComponent({ component, onChange, category }: HeaderComponentProps) {
    const handleFormatChange = (format: 'TEXT' | 'IMAGE' | 'LOCATION' | 'DOCUMENT') => {
        const newComponent: HeaderComponentType = {
            ...component,
            format,
            text: format === 'TEXT' ? '' : undefined,
            example: format === 'IMAGE' ? { header_handle: [''] } : undefined,
        };
        onChange(newComponent);
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange({ ...component, text: e.target.value });
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">Header</Typography>
            
            <FormControl fullWidth size="small">
                <InputLabel>Format</InputLabel>
                <Select
                    value={component.format}
                    label="Format"
                    onChange={(e) => handleFormatChange(e.target.value as any)}
                >
                    <MenuItem value="TEXT">Text</MenuItem>
                    <MenuItem value="IMAGE">Image</MenuItem>
                    {category === 'UTILITY' && <MenuItem value="LOCATION">Location</MenuItem>}
                    {category === 'UTILITY' && <MenuItem value="DOCUMENT">Document</MenuItem>}
                </Select>
            </FormControl>

            {component.format === 'TEXT' && (
                <VariableHighlightInput
                    label="Header Text"
                    value={component.text || ''}
                    onChange={handleTextChange}
                    fullWidth
                    size="small"
                    helperText="Text for the header"
                />
            )}

            {component.format === 'IMAGE' && (
                <Typography variant="body2" color="text.secondary">
                    Image headers require media upload. (Placeholder for image upload)
                </Typography>
            )}
        </Box>
    );
}
