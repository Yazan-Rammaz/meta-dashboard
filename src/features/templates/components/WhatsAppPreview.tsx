import { TemplateComponent } from '@/models/templates';
import { Box, Paper, Typography, styled } from '@mui/material';

const PhoneContainer = styled(Paper)(({ theme }) => ({
    borderRadius: 30,
    border: `8px solid #333`,
    backgroundColor: '#e5ddd5', // WhatsApp default background color
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
}));

const StatusBar = styled(Box)({
    height: 24,
    backgroundColor: '#075e54',
    width: '100%',
});

const AppHeader = styled(Box)({
    height: 50,
    backgroundColor: '#075e54',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 16,
    color: 'white',
    fontWeight: 'bold',
});

const MessageBubble = styled(Box)({
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    margin: 16,
    maxWidth: '85%',
    boxShadow: '0 1px 0.5px rgba(0,0,0,0.13)',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: -8,
        width: 0,
        height: 0,
        border: '8px solid transparent',
        borderTopColor: 'white',
        borderRightColor: 'white',
    },
});

const ComponentBox = styled(Box)({
    marginBottom: 4,
});

interface WhatsAppPreviewProps {
    components: TemplateComponent[];
    category: string;
    compact?: boolean;
}

export default function WhatsAppPreview({
    components,
    category,
    compact = false,
}: WhatsAppPreviewProps) {
    const getHeader = () => components.find((c) => c.type === 'header');
    const getBody = () => components.find((c) => c.type === 'body');
    const getFooter = () => components.find((c) => c.type === 'footer');
    const getButtons = () => components.find((c) => c.type === 'buttons');

    const header = getHeader();
    const body = getBody();
    const footer = getFooter();
    const buttons = getButtons();

    // Helper to replace variables with examples (simple version)
    const renderBodyText = (text: string = '', examples: any) => {
        let processedText = text;

        if (Array.isArray(examples?.body_text_named_params)) {
            examples.body_text_named_params.forEach((p: any) => {
                processedText = processedText.replace(
                    `{{${p.param_name}}}`,
                    p.example || `{{${p.param_name}}}`,
                );
            });
            return processedText;
        }

        const positional = examples?.body_text?.[0];
        if (Array.isArray(positional)) {
            let index = 0;
            processedText = processedText.replace(/\{\{\w+\}\}/g, (match) => {
                const value = positional[index];
                index += 1;
                return value || match;
            });
        }

        return processedText;
    };

    return (
        <Box display="flex" justifyContent="center">
            <PhoneContainer
                elevation={4}
                sx={{
                    width: compact ? 'min(250px, 100%)' : 'min(320px, 100%)',
                    height: compact ? 'min(430px, 55vh)' : 'min(600px, 70vh)',
                }}
            >
                <StatusBar />
                <AppHeader>WhatsApp</AppHeader>
                <Box sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
                    <MessageBubble>
                        {header && (
                            <ComponentBox sx={{ fontWeight: 'bold', mb: 1 }}>
                                {header.format === 'TEXT' ? header.text : '[Media Header]'}
                            </ComponentBox>
                        )}

                        {body && (
                            <ComponentBox
                                sx={{ whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: 1.5 }}
                            >
                                {renderBodyText((body as any).text, (body as any).example)}
                                {(body as any).add_security_recommendation && (
                                    <Typography
                                        variant="caption"
                                        display="block"
                                        color="text.secondary"
                                        sx={{ mt: 1, fontStyle: 'italic' }}
                                    >
                                        (Security recommendation text)
                                    </Typography>
                                )}
                            </ComponentBox>
                        )}

                        {footer && (
                            <ComponentBox sx={{ color: 'text.secondary', fontSize: '11px', mt: 1 }}>
                                {(footer as any).text}
                                {(footer as any).code_expiration_minutes && (
                                    <span>
                                        {' '}
                                        • Expires in {(footer as any).code_expiration_minutes} mins
                                    </span>
                                )}
                            </ComponentBox>
                        )}
                    </MessageBubble>

                    {buttons && (buttons as any).buttons?.length > 0 && (
                        <Box px={2}>
                            {(buttons as any).buttons.map((btn: any, idx: number) => (
                                <Box
                                    key={idx}
                                    sx={{
                                        bgcolor: 'white',
                                        p: 1,
                                        textAlign: 'center',
                                        mb: 1,
                                        borderRadius: 1,
                                        color: '#00a5f4',
                                        fontWeight: 500,
                                        boxShadow: '0 1px 0.5px rgba(0,0,0,0.13)',
                                    }}
                                >
                                    {btn.type === 'OTP' ? 'Copy Code' : btn.text}
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
            </PhoneContainer>
        </Box>
    );
}
