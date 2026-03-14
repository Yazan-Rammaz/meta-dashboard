'use client';

import { useToast } from '@/contexts/toastContext';
import { createTemplateAction } from '@/features/templates/actions';
import ComponentBuilder from '@/features/templates/components/ComponentBuilder';
import WhatsAppPreview from '@/features/templates/components/WhatsAppPreview';
import { Template, TemplateComponent } from '@/models/templates';
import { useGetClientsInfiniteQuery } from '@/services/clients';
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Container,
    FormControlLabel,
    MenuItem,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

const initialState: Omit<Template, 'id' | 'status'> = {
    client_id: '',
    name: '',
    category: 'MARKETING',
    language: 'en_US',
    parameter_format: 'positional',
    components: [],
    send_to_meta: false,
};

export default function CreateTemplatePage() {
    const router = useRouter();
    const { showSuccess, showError } = useToast();
    const [isPending, startTransition] = useTransition();
    const [template, setTemplate] = useState<Omit<Template, 'id' | 'status'>>(initialState);

    const {
        data: infiniteData,
        isLoading: isLoadingClients,
        fetchNextPage,
        hasNextPage,
    } = useGetClientsInfiniteQuery();
    const clients = infiniteData?.pages.flatMap((p) => p.data) || [];

    const handleChange = (field: keyof Template, value: any) => {
        setTemplate((prev) => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
        // console.log('Template updated:', template);
    }, [template]);
    const handleCategoryChange = (category: Template['category']) => {
        setTemplate((prev) => ({
            ...prev,
            category,
            components: [], // Reset components on category change
        }));
    };

    const handleComponentsChange = (components: TemplateComponent[]) => {
        setTemplate((prev) => ({ ...prev, components }));
    };

    const normalizeTemplateName = (value: string) => value.replace(/[-\s]/g, '_');

    const handleSubmit = () => {
        if (!template.client_id) return showError('Client is required');
        if (!template.name) return showError('Name is required');
        if (template.components.length === 0)
            return showError('At least one component is required');
        const payload = {
            ...template,
            name: normalizeTemplateName(template.name),
        };
        console.log('Submitting template:', payload);
        startTransition(async () => {
            const result = await createTemplateAction(payload);
            if (result.success) {
                showSuccess('Template created successfully');
                router.push('/templates');
            } else {
                showError(result.error || 'Failed to create template');
            }
        });
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                <Box sx={{ flex: 1 }}>
                    <Paper sx={{ p: 4 }}>
                        <Typography variant="h4" gutterBottom className="pb-5">
                            Create Template
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Autocomplete
                                options={clients}
                                getOptionLabel={(option) => option.name || ''}
                                onChange={(_, value) => handleChange('client_id', value?.id || '')}
                                loading={isLoadingClients}
                                onScroll={(e) => {
                                    const target = e.target as HTMLElement;
                                    if (
                                        target.scrollTop + target.clientHeight >=
                                            target.scrollHeight - 10 &&
                                        hasNextPage
                                    ) {
                                        fetchNextPage();
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Client"
                                        required
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {isLoadingClients ? (
                                                        <CircularProgress
                                                            color="inherit"
                                                            size={20}
                                                        />
                                                    ) : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                            />

                            <TextField
                                label="Template Name"
                                value={template.name}
                                onChange={(e) =>
                                    handleChange('name', normalizeTemplateName(e.target.value))
                                }
                                required
                                fullWidth
                            />

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    label="Language"
                                    value={template.language}
                                    onChange={(e) => handleChange('language', e.target.value)}
                                    required
                                    fullWidth
                                />

                                <TextField
                                    select
                                    label="Category"
                                    value={template.category}
                                    onChange={(e) => handleCategoryChange(e.target.value as any)}
                                    required
                                    fullWidth
                                >
                                    <MenuItem value="MARKETING">Marketing</MenuItem>
                                    <MenuItem value="UTILITY">Utility</MenuItem>
                                    <MenuItem value="AUTHENTICATION">Authentication</MenuItem>
                                </TextField>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <TextField
                                    select
                                    label="Parameter Format"
                                    value={template.parameter_format}
                                    onChange={(e) =>
                                        handleChange('parameter_format', e.target.value)
                                    }
                                    required
                                    sx={{ width: '50%' }}
                                >
                                    <MenuItem value="named">Named</MenuItem>
                                    <MenuItem value="positional">Positional</MenuItem>
                                </TextField>

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={template.send_to_meta}
                                            onChange={(e) =>
                                                handleChange('send_to_meta', e.target.checked)
                                            }
                                        />
                                    }
                                    label="Send to Meta"
                                />
                            </Box>

                            <ComponentBuilder
                                category={template.category}
                                parameterFormat={template.parameter_format}
                                components={template.components}
                                onChange={handleComponentsChange}
                            />

                            <Box
                                sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}
                            >
                                <Button
                                    onClick={() => router.push('/templates')}
                                    disabled={isPending}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    disabled={isPending}
                                >
                                    {isPending ? 'Creating...' : 'Create Template'}
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Box>

                <Box sx={{ width: { xs: '100%', md: 360 }, flexShrink: 0 }}>
                    <Box position="sticky" top={20}>
                        <Typography variant="h6" gutterBottom align="center">
                            Preview
                        </Typography>
                        <WhatsAppPreview
                            components={template.components}
                            category={template.category}
                        />
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}
