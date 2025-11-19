import ClearInputIcon from '@/ui/Input/clearInput';
import { styled } from '@mui/material';
import { useState } from 'react';

const SelectContainer = styled('div')(
  ({ theme }) => `
      position: relative;
      width: -webkit-fill-available;
      padding-right: 10px;
      display: flex;
      align-items: center;
      cursor: pointer;
    `
);

const SelectedValueContainer = styled('div')(
  ({ theme }) => `
        outline: none;
        background: transparent;
        font-size: 12px;
        color: #404040;
        height: 30px;
        width: 100%;
        border: none;
        border-bottom: .5px solid #cecdcd;
        font-family: "SF-PRO-Rounded-med";
        text-align: left;
        padding-left: 0px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    `
);

const ClearButton = styled('div')(
  () => `
        cursor: pointer;
        position: absolute;
        right: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
    `
);

const DropdownMenu = styled('div')(
  ({ theme }) => `
        position: absolute;
        top: 100%;
        left: 0;
        width: 94%;
        background-color: #FAFAFA; /* Matches input background */
        border: 1px solid #cecdcd; /* Matches input border */
        border-top: none;
        border-radius: 0 0 10px 10px; /* Rounded corners for bottom */
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow */
        z-index: 1000;
        max-height: 200px;
        overflow-y: auto;
        padding: 5px 0;
    `
);

const DropdownItem = styled('div')(
  ({ theme }) => `
        padding: 8px 15px;
        font-size: 12px;
        color: #404040;
        font-family: "SF-PRO-Rounded-med";
        cursor: pointer;

        &:hover {
            background-color: #f0f0f0; /* Light hover effect */
        }
    `
);

interface SelectProps {
  value: string | number;
  onChange: (value: string | number) => void;
  disabled: boolean;
  title?: string;
  size: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  options: { value: string | number; label: string }[];
}

export default function Select({
  onChange,
  value,
  disabled,
  title,
  size,
  options
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);
  const isValueEmpty = value === '' || value === 0;

  const handleToggleDropdown = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  };

  const handleOptionClick = (optionValue: string | number) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleClearSelection = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the dropdown from toggling
    onChange(''); // Reset the value to empty string
    setIsOpen(false); // Close the dropdown after clearing
  };

  return (
    <SelectContainer
      style={{ width: `${size}0%` }}
      onClick={handleToggleDropdown}
    >
      <SelectedValueContainer
        style={
          isValueEmpty || disabled ? { color: '#888' } : { color: '#404040' }
        }
      >
        {selectedOption ? selectedOption.label : title}
        {selectedOption && !disabled && (
          <ClearButton onClick={handleClearSelection}>
            <ClearInputIcon />
          </ClearButton>
        )}
      </SelectedValueContainer>

      {isOpen && !disabled && (
        <DropdownMenu>
          {options.map((option) => (
            <DropdownItem
              key={option.value}
              onClick={(event) => {
                event.stopPropagation();
                handleOptionClick(option.value);
              }}
            >
              {option.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
    </SelectContainer>
  );
}
