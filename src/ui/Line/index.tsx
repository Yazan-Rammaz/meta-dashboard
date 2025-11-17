import { styled } from "@mui/material"

const LineUnder = styled("div")(
    () => `
        width: -webkit-fill-available;
        border-bottom: .5px solid hsla(0, 1%, 80.6%, .7607843137254902);
        margin: 10px 0px 10px 0px;
    `
)

export default function Line() {
    return (<LineUnder />)
}