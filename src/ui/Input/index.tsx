import ClearInputIcon from '@/ui/Input/clearInput';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { styled } from '@mui/material';
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
        text-align: left; /* Ensure text always aligns left */
        padding-left: 0px; /* Consistent padding */
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
      display: flex;
      align-items: center;
      
    `
);
const InputTitle = styled('div')(
  () => `
        position: absolute;
        bottom: 3px; /* Adjusted to move slightly upwards */
        left: 0px !important;
        color: #888;
        pointer-events: none;
        transition: all 0.2s ease-out;
    `
);

const PasswordToggleButton = styled('div')(
  () => `
    cursor: pointer;
    position: absolute;
    right: 30px;
    bottom: 2px;
    z-index: 1000000; /* Increased z-index */
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
  `
);

interface InputProps {
  value: string | number;
  onChange: (value: string | number) => void;
  type: 'text' | 'number' | 'date' | 'password' | 'email';
  clear: () => void;
  disabled: boolean;
  title?: string;
  size: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  showPasswordToggle?: boolean;
}
export default function Input({
  onChange,
  value,
  type,
  clear,
  disabled,
  title,
  size,
  showPasswordToggle
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isValueEmpty = value === '' || value === 0;

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const inputType = showPasswordToggle && showPassword ? 'text' : type;

  return (
    <InputContainer style={{ width: `${size}0%` }}>
      {title && isValueEmpty && !disabled ? (
        <InputTitle>{title}</InputTitle>
      ) : (
        <></>
      )}
      <CustomInput
        value={value}
        type={inputType}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        // Removed conditional padding, it's now fixed in CustomInput styled component
      />
      {showPasswordToggle &&
        type === 'password' &&
        !disabled &&
        value !== '' && (
          <PasswordToggleButton onClick={handleTogglePasswordVisibility}>
            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </PasswordToggleButton>
        )}
      {disabled || isValueEmpty ? (
        <></>
      ) : (
        <ClearInput onClick={() => clear()}>
          <ClearInputIcon />
        </ClearInput>
      )}
    </InputContainer>
  );
}
