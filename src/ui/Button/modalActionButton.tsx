import { styled } from "@mui/material"

const CustomButton = styled("button")(
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
    `
)
interface ButtonProps {
    text: string,
    onClick: () => void,
    disabled: boolean
}
export default function ModalActionButton({ onClick, text, disabled }: ButtonProps) {
    return (<CustomButton onClick={() => onClick()} disabled={disabled}>
        {text}
    </CustomButton>)
}