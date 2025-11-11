import { styled } from '@mui/material';
import ClearMultiSelectIcon from '@/ui/MultiSelect/clearInput';
import { useState } from 'react';
// import ScrollbarWrapedChilds from '@/ui/ScrollbarWrappedChilds';
import Scrollbar from '@/components/Scrollbar';
import ToolTip from '@/ui/Tooltip';

const CustomMultiSelect = styled('input')(
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
const ClearMultiSelect = styled('div')(
  () => `
        position: absolute;
        z-index: 999999;
        bottom: 2px !important;
        right: 10px !important;
    `
);
const MultiSelectContainer = styled('div')(
  () => `
      position: relative;
      width: -webkit-fill-available;
      padding-right: 10px;
      position: relative;
      height: 28px;
      overflow: visible;
    `
);
const MultiSelectTitle = styled('div')(
  () => `
        position: absolute;
        bottom: 2px;
        left: 0px !important;
    `
);
const AsyncMultiSelectItemsContainer = styled('div')(
  () => `
        position: absolute;
        top: 27px;
        z-index: 999999999;
        width: calc(100% - 10px);
         background-color: transparent;
         height: 200px;
    `
);
const AsyncMultiSelectItem = styled('div')(
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

    `
);
const SelectedItemsContainer = styled('div')(
  () => `
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    border: 1px dashed #d5d5d5;
    margin-top: 10px;
    margin-right: 10px;
    border-radius: 10px;
    padding: 5px;
    height: 100px;
    width: -webkit-fill-available;
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
        padding: 5px;
        text-transform: uppercase;
        border-radius: 5px;
        width: fit-content;
    `
);
interface SelectableElement {
  id: string | number;
  title: string;
}

interface MultiSelectProps {
  value?: string;
  onChange: (value: string) => void;
  onSelect: (item: {
    value?: number;
    title?: string;
    description?: string;
  }) => void;
  type: 'text' | 'number';
  clear: () => void;
  disabled: boolean;
  title?: string;
  size: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  data?: Array<{ value: number; title: string; description?: string }>;
  selected?: Array<{ value?: number; title?: string; description?: string }>;
}
export default function AsyncMultiSelect({
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
}: MultiSelectProps) {
  const [focused, setFocused] = useState(false);
  return (
    <>
      <MultiSelectContainer
        style={{ width: `${size}0%` }}
        onClick={() => setFocused(true)}
        onMouseEnter={() => setFocused(true)}
        onMouseLeave={() => setFocused(false)}
      >
        {title ? <MultiSelectTitle>{title}</MultiSelectTitle> : <></>}
        <CustomMultiSelect
          value={value}
          type={type}
          placeholder="search"
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          style={title ? { paddingLeft: '20px' } : { paddingLeft: '0px' }}
        />
        {disabled ? (
          <></>
        ) : (
          <ClearMultiSelect onClick={() => clear()}>
            <ClearMultiSelectIcon />
          </ClearMultiSelect>
        )}
        {focused && !disabled && data && data?.length > 0 && (
          <AsyncMultiSelectItemsContainer>
            <Scrollbar>
              {data?.map((one, index) => (
                <ToolTip
                  key={index}
                  text={one.description ? one.description : 'no description'}
                >
                  <AsyncMultiSelectItem
                    onClick={() => {
                      if (!disabled) onSelect(one);
                    }}
                    sx={{
                      backgroundColor:
                        selected &&
                        selected.some((element) => element.value === one.value)
                          ? '#c2c2c2'
                          : '#DDDDDD'
                    }}
                  >
                    {one.title}
                  </AsyncMultiSelectItem>
                </ToolTip>
              ))}
            </Scrollbar>
          </AsyncMultiSelectItemsContainer>
        )}
      </MultiSelectContainer>
      {selected && selected.length ? (
        <SelectedItemsContainer>
          {/* <ScrollbarWrapedChilds> */}
          {selected?.map((one, index) => (
            <ToolTip
              key={index}
              text={one.description ? one.description : 'no description'}
            >
              <CustomSelectItemSelected>{one.title}</CustomSelectItemSelected>
            </ToolTip>
          ))}
          {/* </ScrollbarWrapedChilds> */}
        </SelectedItemsContainer>
      ) : (
        <></>
      )}
    </>
  );
}
