import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { ReactElement } from 'react';

interface CustomTooltipProps {
    text: string,
    children: ReactElement
}
const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(() => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: "#404040",
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "#404040",
        color: "#FFFFFF",
        fontSize: "10px",
        fontFamily: "SF-Pro-Rounded-regular"
    },
}));
function ToolTip({ text, children }: CustomTooltipProps) {
    return (
        <BootstrapTooltip title={text} placement="top">
            {children}
        </BootstrapTooltip>
    );
}

export default ToolTip;
