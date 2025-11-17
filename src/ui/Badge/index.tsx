import React from 'react';

interface BadgeProps {
  label: string;
  color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
}

const Badge: React.FC<BadgeProps> = ({ label, color }) => {
  let backgroundColor = '';
  let textColor = 'white'; // Revert textColor to white

  switch (color) {
    case 'primary':
      backgroundColor = '#007bff'; // Blue
      break;
    case 'secondary':
      backgroundColor = '#6c757d'; // Gray
      break;
    case 'success':
      backgroundColor = '#28a745'; // Green
      break;
    case 'error':
      backgroundColor = '#dc3545'; // Red
      break;
    case 'warning':
      backgroundColor = '#ffc107'; // Yellow
      textColor = '#333'; // Dark text for yellow badge
      break;
    case 'info':
      backgroundColor = '#17a2b8'; // Cyan
      break;
    default:
      backgroundColor = '#6c757d'; // Default to secondary gray
  }

  const badgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5em 0.6em',
    fontSize: '80%',
    fontWeight: '700',
    lineHeight: '1',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    verticalAlign: 'baseline',
    borderRadius: '0.375rem',
    backgroundColor,
    color: textColor
  };

  return <span style={badgeStyle}>{label}</span>;
};

export default Badge;
