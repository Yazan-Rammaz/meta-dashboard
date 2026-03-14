import { NamedParam } from '@/models/templates';
import { Box, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

interface ParameterEditorProps {
    text: string;
    examples: NamedParam[];
    onExamplesChange: (examples: NamedParam[]) => void;
}

export default function ParameterEditor({ text, examples, onExamplesChange }: ParameterEditorProps) {
    const [params, setParams] = useState<string[]>([]);

    useEffect(() => {
        const regex = /\{\{(\w+)\}\}/g;
        const matches: string[] = [];
        let match;
        while ((match = regex.exec(text || '')) !== null) {
            matches.push(match[1]);
        }
        const uniqueParams = Array.from(new Set(matches));
        
        if (JSON.stringify(uniqueParams) !== JSON.stringify(params)) {
            setParams(uniqueParams);
            
            // Sync examples with current params
            const newExamples: NamedParam[] = uniqueParams.map(param => {
                const existing = examples.find(e => e.param_name === param);
                return existing || { param_name: param, example: '' };
            });
            
            // Only update if changed
            if (JSON.stringify(newExamples) !== JSON.stringify(examples)) {
                onExamplesChange(newExamples);
            }
        }
    }, [text, params, examples, onExamplesChange]);

    const handleExampleChange = (paramName: string, value: string) => {
        const newExamples = examples.map(e => 
            e.param_name === paramName ? { ...e, example: value } : e
        );
        onExamplesChange(newExamples);
    };

    if (params.length === 0) return null;

    return (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px dashed #ccc' }}>
            <Typography variant="subtitle2" gutterBottom color="primary">Parameter Examples</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {params.map(param => (
                    <Box key={param} display="flex" alignItems="center" gap={2}>
                        <Typography variant="body2" sx={{ minWidth: 100, fontWeight: 'bold' }}>
                            {`{{${param}}}`}
                        </Typography>
                        <TextField
                            placeholder={`Example for ${param}`}
                            value={examples.find(e => e.param_name === param)?.example || ''}
                            onChange={(e) => handleExampleChange(param, e.target.value)}
                            size="small"
                            fullWidth
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
