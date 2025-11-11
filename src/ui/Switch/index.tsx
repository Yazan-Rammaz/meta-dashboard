import { styled } from '@mui/material';

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
interface SwitchInputProps {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled: boolean;
  title?: string;
  size: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
}
export default function SwitchInput({
  onChange,
  value,
  disabled,
  title,
  size
}: SwitchInputProps) {
  return (
    <>
      <InputContainer style={{ width: `${size}0%` }}>
        {title ? <InputTitle>{title}</InputTitle> : <></>}
        <label className="switchStatus">
          <input
            type="checkbox"
            disabled={disabled}
            checked={value}
            onChange={(e) => {
              onChange(e.target.checked);
            }}
          />
          <span className="sliderStatus roundStatus">
            <div className="status_switch_yes"> yes </div>
            <div className="status_switch_no"> no </div>
          </span>
        </label>
      </InputContainer>
    </>
  );
}
