import ParameterEditor from '@/features/templates/components/ParameterEditor';
import VariableHighlightInput from '@/features/templates/components/VariableHighlightInput';
import { BodyComponent as BodyComponentType, NamedParam } from '@/models/templates';
import { Box, Typography } from '@mui/material';

interface BodyComponentProps {
    component: BodyComponentType;
    parameterFormat: 'named' | 'positional';
    onChange: (component: BodyComponentType) => void;
}

export default function BodyComponent({
    component,
    parameterFormat,
    onChange,
}: BodyComponentProps) {
    const positionalExamples = component.example?.body_text?.[0] || [];
    const paramMatches = Array.from(component.text.matchAll(/\{\{(\w+)\}\}/g)).map(
        (match) => match[1],
    );
    const uniqueParams = Array.from(new Set(paramMatches));

    const editorExamples: NamedParam[] =
        parameterFormat === 'named'
            ? component.example?.body_text_named_params || []
            : uniqueParams.map((param, index) => ({
                  param_name: param,
                  example: positionalExamples[index] || '',
              }));

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange({ ...component, text: e.target.value });
    };

    const handleExamplesChange = (examples: NamedParam[]) => {
        const examplePayload =
            examples.length > 0
                ? parameterFormat === 'named'
                    ? { body_text_named_params: examples }
                    : { body_text: [examples.map((one) => one.example || '')] }
                : undefined;

        onChange({
            ...component,
            example: examplePayload,
        });
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                p: 2,
                border: '1px solid #ddd',
                borderRadius: 1,
            }}
        >
            <Typography variant="subtitle1" fontWeight="bold">
                Body
            </Typography>

            <VariableHighlightInput
                label="Body Text"
                value={component.text}
                onChange={handleTextChange}
                multiline
                rows={4}
                fullWidth
                helperText="Use {{variable}} for parameters"
            />

            <ParameterEditor
                text={component.text}
                examples={editorExamples}
                onExamplesChange={handleExamplesChange}
            />
        </Box>
    );
}
