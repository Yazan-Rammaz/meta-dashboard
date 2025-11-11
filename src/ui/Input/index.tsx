import { styled } from '@mui/material';
import ClearInputIcon from '@/ui/Input/clearInput';

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
    `
);
const InputTitle = styled('div')(
  () => `
        position: absolute;
        bottom: 2px;
        left: 0px !important;
    `
);
interface InputProps {
  value: string | number;
  onChange: (value: string | number) => void;
  type: 'text' | 'number' | 'date';
  clear: () => void;
  disabled: boolean;
  title?: string;
  size: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
}
export default function Input({
  onChange,
  value,
  type,
  clear,
  disabled,
  title,
  size
}: InputProps) {
  return (
    <InputContainer style={{ width: `${size}0%` }}>
      {title ? <InputTitle>{title}</InputTitle> : <></>}
      <CustomInput
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
    </InputContainer>
  );
}
