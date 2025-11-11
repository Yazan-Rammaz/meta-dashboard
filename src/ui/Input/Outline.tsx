import { styled } from "@mui/material"
import { useEffect } from "react"

const CustomInput = styled("input")(
    () => `
        outline: none;
        background: transparent;
        font-size: 12px;
        color: #404040;
        height: 28px;
        width: 100%;
        border: none;
        font-family: "SF-PRO-Rounded";
        &::placeholder{
            color: #DDDDDD
        }
    `
)

const InputContainer = styled("div")(
    () => `
        margin-top: 7px;
        position: relative;
        width: -webkit-fill-available;
        padding-left: 15px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        background-image: url("data:image/svg+xml,%3csvg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%' height='100%' fill='none' rx='10' ry='10' stroke='%23DDDDDD' stroke-width='1' stroke-dasharray='2%2c3' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
        border-radius: 10px;
        background-color: #FAFAFA;
        min-height: 40px;
    `
)
const WithNoteInputContainer = styled("div")(
    () => `
        margin-top: 7px;
        position: relative;
        width: -webkit-fill-available;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        background-color: #F4F4F4;
        min-height: 62px;
    `
)
const InputContainerInside = styled("div")(
    () => `
        position: relative;
        width: -webkit-fill-available;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        background-image: url("data:image/svg+xml,%3csvg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%' height='100%' fill='none' rx='10' ry='10' stroke='%23DDDDDD' stroke-width='1' stroke-dasharray='2%2c3' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
        border-radius: 10px;
        background-color: #FAFAFA;
        min-height: 40px;
        padding-left: 15px;
    `
)
const NoteText = styled("div")(
    () => `
       height: 22px;
       font-family: "SF-PRO-Rounded-light";
       font-size: 10px;
       color: #CBCBCB;
    `
)
const InputTitle = styled("div")(
    () => `
        position: absolute;
        bottom: 2px;
        left: 0px !important;
    `
)
interface InputProps {
    value: string | number,
    onChange: (value: string | number) => void,
    type: "text" | "number" | "date",
    disabled: boolean,
    title?: string,
    size: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
    placeholder: string,
    withNote?: boolean,
    note?: string,
    invalidate?: number
}
export default function OutlineInput({ withNote, note, placeholder, onChange, value, type, disabled, title, size, invalidate }: InputProps) {

    const random = Math.random() + Math.random()

    useEffect(() => {
        if (invalidate && invalidate > 0) {
            const element = document.getElementById(random.toString())
            if (element) {
                element.classList.add("shake-modal");
                element.classList.add("red-bord");
                setTimeout(() => {
                    element.classList.remove("shake-modal");
                }, 600);
                setTimeout(() => {
                    element.classList.remove("red-bord");
                }, 1000);
            }

        }
    }, [invalidate, random])

    if (withNote) {
        return (<WithNoteInputContainer style={{ width: `${size}0%` }}>
            <InputContainerInside id={random.toString()}>
                {title ? <InputTitle>
                    {title}
                </InputTitle> : <></>}
                <CustomInput placeholder={placeholder} type={type} value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} style={title ? { paddingLeft: "20px" } : { paddingLeft: "0px" }} />
            </InputContainerInside>
            <NoteText>
                {note}
            </NoteText>
        </WithNoteInputContainer>)
    } else {
        return (
            <InputContainer id={random.toString()} style={{ width: `${size}0%` }}>
                {title ? <InputTitle>
                    {title}
                </InputTitle> : <></>}
                <CustomInput placeholder={placeholder} type={type} value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} style={title ? { paddingLeft: "20px" } : { paddingLeft: "0px" }} />
            </InputContainer>
        )
    }
}