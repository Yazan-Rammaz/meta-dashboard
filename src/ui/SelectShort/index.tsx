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
        max-height: 15px;
        position: relative;
        font-family: 'SF-PRO-Rounded_light';
        font-size: 10px;
        color: #FAFAFA;
        background-color: #8E8E8E;
        border-radius: 5px;
        text-transform: uppercase;
        width: 15px;
        height: 15px;
    `
);
const CustomSelectItemContainer = styled('div')(
  () => `        
        display: flex;
        align-items: center;
        justify-content: center;
        width: 21px;
        height: 21px;
        margin-left: 4px;
        margin-right: 4px;
    `
);
const CustomSelectItemSelectedContainer = styled('div')(
  () => `
        display: flex;
        align-items: center;
        justify-content: center;
        width: 21px;
        height: 21px;
        border-radius: 5px;
        border: 0.5px solid #6694FC;
        margin-left: 4px;
        margin-right: 4px;
    `
);
const CustomSelectItemSelected = styled('div')(
  () => `
        display: flex;
        align-items: center;
        justify-content: center;
        max-height: 15px;
        position: relative;
        font-family: 'SF-PRO-Rounded_light';
        font-size: 10px;
        color: #FAFAFA;
        background-color: #404040;
        border-radius: 5px;
        text-transform: uppercase;
        width: 15px;
        height: 15px;
    `
);
interface SelectableElement {
  id?: number | string;
  title?: string | ReactElement;
}
interface SelectShortProps {
  items: Array<SelectableElement>;
  onSelect: (id: string | number | null) => void;
  selected: number | string | null;
  disabled: boolean;
  justify?: 'start' | 'end' | 'center';
}
export default function SelectShort({
  items,
  onSelect,
  selected,
  disabled,
  justify
}: SelectShortProps) {
  return (
    <CustomSelectContainer
      style={{
        justifyContent: justify ? justify : 'flex-start'
      }}
    >
      {items?.map((item, index) => {
        if (item.id === selected) {
          return (
            <CustomSelectItemSelectedContainer key={item.id || index}>
              <CustomSelectItemSelected
                style={{ cursor: disabled ? 'default' : 'pointer' }}
                onClick={() => {
                  if (!disabled) {
                    onSelect(null);
                  }
                }}
              >
                {item.title}
              </CustomSelectItemSelected>
            </CustomSelectItemSelectedContainer>
          );
        } else {
          return (
            <CustomSelectItemContainer key={item.id || index}>
              <CustomSelectItem
                style={{ cursor: disabled ? 'default' : 'pointer' }}
                onClick={() => {
                  if (!disabled) {
                    onSelect(item.id ?? null);
                  }
                }}
              >
                {item.title}
              </CustomSelectItem>
            </CustomSelectItemContainer>
          );
        }
      })}
    </CustomSelectContainer>
  );
}
