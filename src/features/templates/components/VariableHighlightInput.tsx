import { Box, TextField, TextFieldProps, styled } from '@mui/material';

const HighlightOverlay = styled('div')({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    whiteSpace: 'pre-wrap',
    overflowWrap: 'break-word',
    color: 'transparent',
    padding: '16.5px 14px', // Matches MUI default OutlinedInput padding
    fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
    fontSize: '1rem',
    lineHeight: '1.4375em',
    letterSpacing: '0.00938em',
    boxSizing: 'border-box',
    '& span.highlight': {
        backgroundColor: '#e3f2fd',
        color: 'transparent', // Text color handled by textarea
        borderRadius: '2px',
        border: '1px solid #90caf9',
    },
});

const Container = styled(Box)({
    position: 'relative',
    '& textarea': {
        zIndex: 1,
        background: 'transparent',
    }
});

interface VariableHighlightInputProps extends Omit<TextFieldProps, 'variant'> {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function VariableHighlightInput(props: VariableHighlightInputProps) {
    const { value, ...other } = props;
    
    // Simple highlight logic for {{param}}
    const getHighlightedText = (text: string) => {
        const parts = text.split(/(\{\{[\w]+\}\})/g);
        return parts.map((part, index) => {
            if (part.match(/^\{\{[\w]+\}\}$/)) {
                return <span key={index} className="highlight">{part}</span>;
            }
            return <span key={index}>{part}</span>;
        });
    };

    return (
        <Container>
            {/* Overlay for highlighting (simplified) */}
            {/* Note: Perfect overlay alignment with textarea is hard. 
                For MVP, we might skip the visual overlay if alignment is tricky, 
                or just use a colored border on the input itself when valid.
                Here, we'll just render the TextField normally for now but this component 
                can be enhanced later to support the overlay properly.
             */}
             <TextField
                {...other}
                value={value}
                multiline
                fullWidth
            />
        </Container>
    );
}
