import { styled } from "@mui/material"

const CustomButton = styled("button")(
    () => `
    background-color: #404040;
    color: #fff;
    width: fit-content;
    font-size: 10px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, .16);
    border-radius: 5px;
    margin-right: 15px;
    text-align: center;
    padding: 5px;
    `
)
interface ButtonProps {
    text: string,
    onClick: () => void,
    disabled: boolean
}
export default function Button({ onClick, text, disabled }: ButtonProps) {
    return (<CustomButton onClick={() => onClick()} disabled={disabled}>
        {text}
    </CustomButton>)
}