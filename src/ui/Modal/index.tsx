import { styled } from "@mui/material";
import { ReactElement } from "react";

const ModalContainer = styled("div")(
    () => `
    width: 430px;
    border-radius: 10px;
    background-color: #f7f7f7;
    position: fixed;
    top: 150px;
    right: 15px;
    height: auto;
    display: block !important;
    z-index: 987;
    border: .5px dashed #DDDDDD;
    height: calc(100vh - 170px);
    overflow: hidden;
    animation: slideInLeft 0.5s ease 0s;
`
);

interface ModalProps {
    children: ReactElement,
    open: boolean
}
export default function ModalComponent({ children, open }: ModalProps) {
    return (<>
        {open ? <ModalContainer>
            {children}
        </ModalContainer> : <></>}
    </>)
}