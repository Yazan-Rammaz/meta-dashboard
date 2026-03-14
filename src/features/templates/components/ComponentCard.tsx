import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Card, Collapse, IconButton, Typography, styled } from '@mui/material';
import { useState } from 'react';

const CardHeader = styled(Box)(
    ({ theme }) => `
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing(1, 2)};
  background-color: ${theme.colors.alpha.black[5]};
  cursor: pointer;
  border-bottom: 1px solid ${theme.colors.alpha.black[10]};
`
);

interface ComponentCardProps {
    title: string;
    onDelete: () => void;
    children: React.ReactNode;
    defaultExpanded?: boolean;
}

export default function ComponentCard({ title, onDelete, children, defaultExpanded = true }: ComponentCardProps) {
    const [expanded, setExpanded] = useState(defaultExpanded);

    return (
        <Card variant="outlined" sx={{ mb: 2, overflow: 'hidden' }}>
            <CardHeader onClick={() => setExpanded(!expanded)}>
                <Box display="flex" alignItems="center" gap={1}>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}>
                        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                    <Typography variant="subtitle2" fontWeight="bold">
                        {title}
                    </Typography>
                </Box>
                <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
                    <DeleteIcon />
                </IconButton>
            </CardHeader>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box p={2}>
                    {children}
                </Box>
            </Collapse>
        </Card>
    );
}
