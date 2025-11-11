import { styled, List } from "@mui/material";
import { ReactElement } from "react";

const ListContainer = styled(List)(
    () => `
    display: flex;
    flex-direction: column;
`
);

interface ListProps {
    children: ReactElement
}

export default function ListComponent({ children }: ListProps) {
    return (<ListContainer disablePadding>
        {children}
    </ListContainer>)
}