import { styled } from '@mui/material';
import ClearInputIcon from '@/ui/Input/clearInput';
import Scrollbar from '@/components/Scrollbar';
import { useState } from 'react';

const CustomInput = styled('input')(
  () => `
        outline: none;
        background: transparent;
        font-size: 12px;
        color: #404040;
        height: 28px;
        width: 100%;
        border: none;
        border-bottom: .5px solid #cecdcd;
        font-family: "SF-PRO-Rounded-med";
    `
);
const ClearInput = styled('div')(
  () => `
        position: absolute;
        z-index: 999999;
        bottom: 2px !important;
        right: 10px !important;
    `
);
const InputContainer = styled('div')(
  () => `
      position: relative;
      width: -webkit-fill-available;
      padding-right: 10px;
      position: relative;
      height: 28px;
      overflow: visible;
    `
);
const InputTitle = styled('div')(
  () => `
        position: absolute;
        bottom: 2px;
        left: 0px !important;
    `
);
const AsyncInputItemsContainer = styled('div')(
  () => `
        position: absolute;
        top: 27px;
        z-index: 99999999999;
        width: calc(100% - 10px);
         background-color: #FAFAFA;
         height: 200px;
    `
);
const AsyncInputItem = styled('div')(
  () => `
        width: 100%;
        margin-top: 2px;
        transition: 0.3s;
        padding: 12px 15px;
        background-color: #DDDDDD;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-direction: row;
        font-size: 14px;
        color: #404040;
        text-transform: capitalize;
        cursor: pointer;
        z-index: 99999999999;
    `
);
interface InputProps {
  value?: string | number;
  onChange: (value: string | number) => void;
  onSelect: (item: { value: number; title: string }) => void;
  type: 'text' | 'number';
  clear: () => void;
  disabled: boolean;
  title?: string;
  size: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  data?: Array<{ value: number; title: string }>;
  selected?: { value: number; title: string };
}
export default function AsyncInput({
  onChange,
  value,
  type,
  clear,
  disabled,
  title,
  size,
  data,
  onSelect,
  selected
}: InputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <>
      <InputContainer
        onClick={() => setFocused(true)}
        onMouseEnter={() => setFocused(true)}
        onMouseLeave={() => setFocused(false)}
        style={{ width: `${size}0%` }}
      >
        {title ? <InputTitle>{title}</InputTitle> : <></>}
        <CustomInput
          placeholder="search"
          value={value}
          type={type}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          style={title ? { paddingLeft: '20px' } : { paddingLeft: '0px' }}
        />
        {disabled ? (
          <></>
        ) : (
          <ClearInput onClick={() => clear()}>
            <ClearInputIcon />
          </ClearInput>
        )}
        {focused && !disabled && data && data?.length > 0 && (
          <AsyncInputItemsContainer>
            <Scrollbar>
              {data?.map((one, index) => (
                <AsyncInputItem
                  key={index}
                  onClick={() => {
                    if (one.value === selected?.value) {
                      setFocused(false);
                    } else {
                      onSelect(one);
                      setFocused(false);
                    }
                  }}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#c2c2c2'
                    }
                  }}
                >
                  {one.title}
                </AsyncInputItem>
              ))}
            </Scrollbar>
          </AsyncInputItemsContainer>
        )}
      </InputContainer>
    </>
  );
}
