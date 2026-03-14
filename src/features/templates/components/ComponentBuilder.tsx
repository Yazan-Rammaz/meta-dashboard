import AuthBodyComponent from '@/features/templates/components/AuthBodyComponent';
import AuthFooterComponent from '@/features/templates/components/AuthFooterComponent';
import BodyComponent from '@/features/templates/components/BodyComponent';
import ButtonsComponent from '@/features/templates/components/ButtonsComponent';
import ComponentCard from '@/features/templates/components/ComponentCard';
import FooterComponent from '@/features/templates/components/FooterComponent';
import HeaderComponent from '@/features/templates/components/HeaderComponent';
import {
    AuthBodyComponent as AuthBodyComponentType,
    AuthFooterComponent as AuthFooterComponentType,
    BodyComponent as BodyComponentType,
    ButtonsComponent as ButtonsComponentType,
    FooterComponent as FooterComponentType,
    HeaderComponent as HeaderComponentType,
    TemplateComponent,
} from '@/models/templates';
import { Box, Button, Typography } from '@mui/material';

interface ComponentBuilderProps {
    category: 'AUTHENTICATION' | 'MARKETING' | 'UTILITY';
    parameterFormat: 'named' | 'positional';
    components: TemplateComponent[];
    onChange: (components: TemplateComponent[]) => void;
}

export default function ComponentBuilder({
    category,
    parameterFormat,
    components,
    onChange,
}: ComponentBuilderProps) {
    const handleAddComponent = (type: TemplateComponent['type']) => {
        let newComponent: TemplateComponent;

        if (type === 'HEADER') {
            newComponent = { type: 'HEADER', format: 'TEXT', text: '' } as HeaderComponentType;
        } else if (type === 'body') {
            if (category === 'AUTHENTICATION') {
                newComponent = {
                    type: 'body',
                    add_security_recommendation: true,
                } as AuthBodyComponentType;
            } else {
                newComponent = { type: 'body', text: '' } as BodyComponentType;
            }
        } else if (type === 'FOOTER') {
            if (category === 'AUTHENTICATION') {
                newComponent = {
                    type: 'FOOTER',
                    code_expiration_minutes: 5,
                } as AuthFooterComponentType;
            } else {
                newComponent = { type: 'FOOTER', text: '' } as FooterComponentType;
            }
        } else if (type === 'BUTTONS') {
            newComponent = { type: 'BUTTONS', buttons: [] } as ButtonsComponentType;
        } else {
            return;
        }

        onChange([...components, newComponent]);
    };

    const handleUpdateComponent = (index: number, updatedComponent: TemplateComponent) => {
        const newComponents = [...components];
        newComponents[index] = updatedComponent;
        onChange(newComponents);
    };

    const handleRemoveComponent = (index: number) => {
        onChange(components.filter((_, i) => i !== index));
    };

    const hasComponent = (type: TemplateComponent['type']) => {
        return components.some((c) => c.type === type);
    };

    const renderComponent = (component: TemplateComponent, index: number) => {
        const commonProps = {
            category,
            // Add other common props if needed
        };

        if (component.type === 'HEADER') {
            return (
                <HeaderComponent
                    key={index}
                    component={component}
                    onChange={(c) => handleUpdateComponent(index, c)}
                    category={category}
                />
            );
        }
        if (component.type === 'body') {
            if (category === 'AUTHENTICATION') {
                return (
                    <AuthBodyComponent
                        key={index}
                        component={component as AuthBodyComponentType}
                        onChange={(c) => handleUpdateComponent(index, c)}
                    />
                );
            }
            return (
                <BodyComponent
                    key={index}
                    component={component as BodyComponentType}
                    parameterFormat={parameterFormat}
                    onChange={(c) => handleUpdateComponent(index, c)}
                />
            );
        }
        if (component.type === 'FOOTER') {
            if (category === 'AUTHENTICATION') {
                return (
                    <AuthFooterComponent
                        key={index}
                        component={component as AuthFooterComponentType}
                        onChange={(c) => handleUpdateComponent(index, c)}
                    />
                );
            }
            return (
                <FooterComponent
                    key={index}
                    component={component as FooterComponentType}
                    onChange={(c) => handleUpdateComponent(index, c)}
                />
            );
        }
        if (component.type === 'BUTTONS') {
            return (
                <ButtonsComponent
                    key={index}
                    component={component as ButtonsComponentType}
                    onChange={(c) => handleUpdateComponent(index, c)}
                    category={category}
                />
            );
        }
        return null;
    };

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
                Components
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                {!hasComponent('HEADER') && category !== 'AUTHENTICATION' && (
                    <Button variant="outlined" onClick={() => handleAddComponent('HEADER')}>
                        Add Header
                    </Button>
                )}
                {!hasComponent('body') && (
                    <Button variant="outlined" onClick={() => handleAddComponent('body')}>
                        Add Body
                    </Button>
                )}
                {!hasComponent('FOOTER') && (
                    <Button variant="outlined" onClick={() => handleAddComponent('FOOTER')}>
                        Add Footer
                    </Button>
                )}
                {!hasComponent('BUTTONS') && (
                    <Button variant="outlined" onClick={() => handleAddComponent('BUTTONS')}>
                        Add Buttons
                    </Button>
                )}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {components.map((c, i) => (
                    <ComponentCard key={i} title={c.type} onDelete={() => handleRemoveComponent(i)}>
                        {renderComponent(c, i)}
                    </ComponentCard>
                ))}
            </Box>
        </Box>
    );
}
