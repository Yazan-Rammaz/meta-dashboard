import Chip from '@mui/material/Chip';

interface TemplateStatusBadgeProps {
    status?: string;
    size?: 'small' | 'medium';
}

const STATUS_STYLES: Record<string, { bg: string; color: string; border: string }> = {
    APPROVED: { bg: '#e8f5e9', color: '#1b5e20', border: '#a5d6a7' },
    PENDING: { bg: '#fff8e1', color: '#8a6d1d', border: '#ffe082' },
    REJECTED: { bg: '#ffebee', color: '#b71c1c', border: '#ef9a9a' },
    PAUSED: { bg: '#eceff1', color: '#37474f', border: '#b0bec5' },
    DISABLED: { bg: '#eceff1', color: '#37474f', border: '#b0bec5' },
    DRAFT: { bg: '#e3f2fd', color: '#0d47a1', border: '#90caf9' },
};

export default function TemplateStatusBadge({ status, size = 'small' }: TemplateStatusBadgeProps) {
    const normalized = (status || 'UNKNOWN').toUpperCase();
    const styles = STATUS_STYLES[normalized] || {
        bg: '#f3f4f6',
        color: '#374151',
        border: '#d1d5db',
    };

    return (
        <Chip
            size={size}
            label={normalized}
            sx={{
                bgcolor: styles.bg,
                color: styles.color,
                border: `1px solid ${styles.border}`,
                fontWeight: 700,
                letterSpacing: '0.02em',
            }}
        />
    );
}
