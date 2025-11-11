import { styled } from "@mui/material";
import { ReactElement } from "react";

const ModalBodyContainer = styled("div")(
    () => `
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    padding-left: 10px;
    padding-right: 10px;
`
);
interface ModalProps {
    children?: ReactElement
}
export default function ModalBody({ children }: ModalProps) {
    return (<ModalBodyContainer>
        {children}
    </ModalBodyContainer>)
}