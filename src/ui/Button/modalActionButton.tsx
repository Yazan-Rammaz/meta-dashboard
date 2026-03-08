import { CircularProgress, styled } from '@mui/material';

const CustomButton = styled('button')(
    () => `
    background-color: #46C43E;
    color: #FAFAFA;
    width: 400px;
    height: 40px;
    font-size: 14px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, .1);
    border-radius: 10px;
    text-align: center;
    padding: 5px;
    font-family: SF-Pro-Rounded-med;
    position: absolute;
    bottom: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    `,
);
interface ButtonProps {
    text: string;
    onClick: () => void;
    disabled: boolean;
    loading?: boolean;
}
export default function ModalActionButton({ onClick, text, disabled, loading }: ButtonProps) {
    return (
        <CustomButton onClick={() => onClick()} disabled={disabled || loading}>
            {loading && <CircularProgress size={16} color="inherit" />}
            {text}
        </CustomButton>
    );
}
