import { styled } from '@mui/material';
import { ReactElement } from 'react';

const CustomSelectContainer = styled('div')(
  () => `
    display: flex;
    flex-wrap: no-wrap;
    align-items: center;
    justify-content: flex-start;
    flex-direction: row !important;
    width: 100%;
    `
);
const CustomSelectItem = styled('div')(
  () => `
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 4px;
        margin-left: 4px;
        max-height: 18px;
        position: relative;
        font-family: "SF-Pro-Rounded";
        font-size: 12px;
        color: #FAFAFA;
        background-color: transparent;
        text-transform: uppercase;
        width: 21px;
        min-height: 21px;
        max-height: 21px;
        border-radius: 5px;
    `
);
const CustomSelectItemSelected = styled('div')(
  () => `
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 4px;
        margin-left: 4px;
        max-height: 18px;
        position: relative;
        font-family: "SF-Pro-Rounded";
        font-size: 12px;
        color: #FAFAFA;
        background-color: transparent;
        text-transform: uppercase;
        border: 0.5px solid #6694FC;
        border-radius: 5px;
        width: 21px;
        min-height: 21px;
        max-height: 21px;
    `
);
interface SelectableElement {
  id: number | string;
  icon: ReactElement;
}
interface SelectShortProps {
  items: Array<SelectableElement>;
  onSelect: (id: string | number | null) => void;
  selected: number | string | null;
  disabled: boolean;
  justify?: 'start' | 'end' | 'center';
  is_text?: boolean;
}

export default function SelectShortIcons({
  items,
  onSelect,
  selected,
  disabled,
  justify,
  is_text
}: SelectShortProps) {
  return (
    <CustomSelectContainer
      style={{
        justifyContent: justify ? justify : 'flex-start'
      }}
    >
      {items?.map((item, _index) => {
        if (item.id === selected) {
          return (
            <CustomSelectItemSelected
              key={item.id}
              style={{
                cursor: disabled ? 'default' : 'pointer',
                backgroundColor: is_text ? '#404040' : 'transparent'
              }}
              onClick={() => {
                if (!disabled) {
                  onSelect(null);
                }
              }}
            >
              {item.icon}
            </CustomSelectItemSelected>
          );
        } else {
          return (
            <CustomSelectItem
              key={item.id}
              style={{
                cursor: disabled ? 'default' : 'pointer',
                backgroundColor: is_text ? '#404040' : 'transparent'
              }}
              onClick={() => {
                if (!disabled) {
                  onSelect(item.id);
                }
              }}
            >
              {item.icon}
            </CustomSelectItem>
          );
        }
      })}
    </CustomSelectContainer>
  );
}
