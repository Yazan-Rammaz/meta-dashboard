import { styled } from '@mui/material';
import { ReactElement } from 'react';

const CustomSelectContainer = styled('div')(
  () => `
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    flex-direction: row !important;
    margin-top: 8px;
    width: 100%;
    `
);
const CustomSelectItem = styled('div')(
  () => `
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 4px;
        max-height: 18px;
        position: relative;
        font-family: "SF-Pro-Rounded";
        font-size: 12px;
        color: #FAFAFA;
        background-color: #8e8e8e;
            padding: 4px;
    border-radius: 3px;
    text-transform: uppercase;
    `
);
const CustomSelectItemSelected = styled('div')(
  () => `
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 4px;
        max-height: 18px;
        position: relative;
        font-family: "SF-Pro-Rounded";
        font-size: 12px;
        color: #FAFAFA;
        background-color: #5d5d5d;
            padding: 4px;
    border-radius: 3px;
    text-transform: uppercase;
    `
);
interface SelectableElement {
  id: number | string;
  title: string | ReactElement;
}
interface SelectShortProps {
  items: Array<SelectableElement>;
  onSelect: (id: string | number, isSelected: boolean) => void;
  selected: Array<string | number>;
  disabled: boolean;
}
export default function MultiSelectShort({
  items,
  onSelect,
  selected,
  disabled
}: SelectShortProps) {
  return (
    <CustomSelectContainer>
      {items?.map((item, index) => {
        if (selected?.filter((one) => one === item.id)?.length) {
          return (
            <CustomSelectItemSelected
              style={{ cursor: disabled ? 'default' : 'pointer' }}
              onClick={() => {
                if (!disabled) {
                  onSelect(item.id, false);
                }
              }}
              key={index}
            >
              {item.title}
            </CustomSelectItemSelected>
          );
        } else {
          return (
            <CustomSelectItem
              style={{ cursor: disabled ? 'default' : 'pointer' }}
              onClick={() => {
                if (!disabled) {
                  onSelect(item.id, true);
                }
              }}
              key={index}
            >
              {item.title}
            </CustomSelectItem>
          );
        }
      })}
    </CustomSelectContainer>
  );
}
