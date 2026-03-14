import { 
    Button, 
    ButtonsComponent as ButtonsComponentType, 
    OtpButton, 
    PhoneNumberButton, 
    QuickReplyButton, 
    UrlButton 
} from '@/models/templates';
import { Box, Button as MuiButton, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface ButtonsComponentProps {
    component: ButtonsComponentType;
    onChange: (component: ButtonsComponentType) => void;
    category: string;
}

export default function ButtonsComponent({ component, onChange, category }: ButtonsComponentProps) {
    const handleAddButton = () => {
        // Default button type based on category
        let newButton: Button;
        if (category === 'AUTHENTICATION') {
            newButton = { type: 'OTP', otp_type: 'COPY_CODE', text: 'Copy Code' } as OtpButton;
        } else {
            newButton = { type: 'QUICK_REPLY', text: '' } as QuickReplyButton;
        }
        
        onChange({
            ...component,
            buttons: [...component.buttons, newButton]
        });
    };

    const handleRemoveButton = (index: number) => {
        onChange({
            ...component,
            buttons: component.buttons.filter((_, i) => i !== index)
        });
    };

    const handleButtonChange = (index: number, newButton: Button) => {
        const newButtons = [...component.buttons];
        newButtons[index] = newButton;
        onChange({ ...component, buttons: newButtons });
    };

    const renderButtonFields = (button: Button, index: number) => {
        const handleChange = (updates: Partial<Button>) => {
            handleButtonChange(index, { ...button, ...updates } as Button);
        };

        return (
            <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 2, p: 1, border: '1px dashed #eee' }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Type</InputLabel>
                    <Select
                        value={button.type}
                        label="Type"
                        onChange={(e) => {
                            const type = e.target.value;
                            // Reset fields based on type
                            let newBtn: Button;
                            if (type === 'QUICK_REPLY') newBtn = { type: 'QUICK_REPLY', text: button.text || '' };
                            else if (type === 'URL') newBtn = { type: 'URL', text: button.text || '', url: '' };
                            else if (type === 'PHONE_NUMBER') newBtn = { type: 'PHONE_NUMBER', text: button.text || '', phone_number: '' };
                            else if (type === 'MPM') newBtn = { type: 'MPM', text: button.text || '' };
                            else if (type === 'OTP') newBtn = { type: 'OTP', otp_type: 'COPY_CODE', text: 'Copy Code' };
                            else newBtn = { type: 'QUICK_REPLY', text: '' };
                            
                            handleButtonChange(index, newBtn);
                        }}
                    >
                        {category === 'AUTHENTICATION' ? (
                            <MenuItem value="OTP">OTP</MenuItem>
                        ) : (
                            [
                                <MenuItem key="qr" value="QUICK_REPLY">Quick Reply</MenuItem>,
                                <MenuItem key="url" value="URL">URL</MenuItem>,
                                <MenuItem key="phone" value="PHONE_NUMBER">Phone Number</MenuItem>,
                                <MenuItem key="mpm" value="MPM">Multi-Product</MenuItem>
                            ]
                        )}
                    </Select>
                </FormControl>

                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <TextField
                        label="Button Text"
                        value={button.text || ''}
                        onChange={(e) => handleChange({ text: e.target.value })}
                        size="small"
                        fullWidth
                    />
                    
                    {button.type === 'URL' && (
                        <TextField
                            label="URL"
                            value={(button as UrlButton).url}
                            onChange={(e) => handleChange({ url: e.target.value })}
                            size="small"
                            fullWidth
                        />
                    )}
                    
                    {button.type === 'PHONE_NUMBER' && (
                        <TextField
                            label="Phone Number"
                            value={(button as PhoneNumberButton).phone_number}
                            onChange={(e) => handleChange({ phone_number: e.target.value })}
                            size="small"
                            fullWidth
                        />
                    )}

                    {button.type === 'OTP' && (
                        <FormControl size="small" fullWidth>
                            <InputLabel>OTP Type</InputLabel>
                            <Select
                                value={(button as OtpButton).otp_type}
                                label="OTP Type"
                                onChange={(e) => handleChange({ otp_type: e.target.value as 'COPY_CODE' | 'ONE_TAP' })}
                            >
                                <MenuItem value="COPY_CODE">Copy Code</MenuItem>
                                <MenuItem value="ONE_TAP">One Tap Autofill</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                </Box>

                <IconButton onClick={() => handleRemoveButton(index)} size="small" color="error">
                    <DeleteIcon />
                </IconButton>
            </Box>
        );
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1" fontWeight="bold">Buttons</Typography>
                <MuiButton onClick={handleAddButton} size="small" variant="outlined">
                    Add Button
                </MuiButton>
            </Box>
            
            <Box>
                {component.buttons.map((btn, idx) => renderButtonFields(btn, idx))}
                {component.buttons.length === 0 && (
                    <Typography variant="body2" color="text.secondary">No buttons added.</Typography>
                )}
            </Box>
        </Box>
    );
}
