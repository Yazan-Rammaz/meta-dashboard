import Add from '@/ui/icons/add.js';
import Closed from '@/ui/icons/closed.svg';
import Delete from '@/ui/icons/delete.js';
import Edit from '@/ui/icons/edit.svg';
import Opened from '@/ui/icons/opened.svg';
import Spinner from '@/ui/Spinner';
import SpinnerError from '@/ui/Spinner/spinner_error';
import SpinnerSuccess from '@/ui/Spinner/spinner_success';
import ToolTip from '@/ui/Tooltip';
import CanCall from '@/utils/ability';
import useTrans from '@/utils/translation_util';
import { Collapse, styled } from '@mui/material';
import Image from 'next/image';
import { ReactElement, useEffect, useState } from 'react';

const ListItemAllContainer = styled('div')(
  () => `
    min-width: 170px;
    margin-top: 10px;
`
);
const ListItemContainer = styled('div')(
  () => `
    display: flex;
    flex-direction: row;
    flex-wrap: no-wrap;
    width: fit-content;
    position: relative;
    align-items: center;
    justify-content: start;
    min-width: 170px;
    color: #5D5D5D;
    font-size: 14px;
    padding: 7px 7px 0px 7px;
    cursor: pointer;
`
);
const ListItemText = styled('div')(
  () => `
    display: flex;
    flex-direction: row;
    width: fit-content;
    position: relative;
    align-items: center;
    justify-content: start;
    flex-wrap: no-wrap;
    color: #5D5D5D;
    font-size: 14px;
`
);
const NestedCount = styled('div')(
  () => `
    margin-left: 10px;
    background-color: #EFEFEF;
    width: 23px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #5D5D5D;
    height: 15px;
    border-radius: 2px;
    font-size: 12px;
`
);
const Options = styled('div')(
  () => `
    margin-left: 10px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #5D5D5D;
    height: 15px;
    font-size: 12px;
    animation-name: options-slide;
    animation-duration: .5s;
    animation-iteration-count: 1;
`
);
const Status = styled('div')(
  () => `
    margin-left: 20px;
    display: flex;
    -webkit-box-pack: end;
    justify-content: flex-end;
    height: 15px;
    color: #34C16A;
    font-size: 8px;
    flex-direction: row;
    align-items: center;
    flex-wrap: nowrap;
    line-height: 15px;
    transition: all 0.5s ease 0s;
    svg{
        margin: 5px;
    }
`
);
const Option = styled('div')(
  () => `
    width: 15px;
    height: 15px;
`
);
interface ListItemProps {
  children: ReactElement | string;
  nested?: ReactElement;
  openItem?: () => void;
  hasNested?: boolean;
  nestedCount?: number;
  hasAddChild?: boolean;
  addChild?: () => void;
  hasDelete?: boolean;
  handleDelete?: ((item: any) => void) | undefined; // Changed from deleteItem to handleDelete
  item?: any;
  forceOpen?: boolean;
  add_permission?: string;
  delete_permission?: string;
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  deleteText?: string; // Add deleteText prop
  edit_permission?: string;
  onEdit?: () => void;
  onDelete?: () => void; // Add onDelete prop
}

export default function ListItemComponent({
  children,
  nested,
  openItem,
  hasNested,
  nestedCount,
  addChild,
  handleDelete, // Changed from deleteItem to handleDelete
  hasAddChild,
  hasDelete,
  forceOpen,
  add_permission,
  delete_permission,
  isLoading,
  isError,
  isSuccess,
  deleteText = 'Delete',
  onEdit,
  edit_permission,
  onDelete // Destructure onDelete
}: ListItemProps) {
  const trans = useTrans();

  const [open, setOpen] = useState(forceOpen);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setSuccess(true);
      const timeout = setTimeout(() => {
        setSuccess(false);
      }, 1500);
      return () => clearTimeout(timeout);
    } else {
      setSuccess(false);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      setError(true);
      const timeout = setTimeout(() => {
        setError(false);
      }, 1500);
      return () => clearTimeout(timeout);
    } else {
      setError(false);
    }
  }, [isError]);

  const handleClick = () => {
    setOpen(!open);
  };
  useEffect(() => {
    if (forceOpen === true) {
      setOpen(true);
    }
  }, [forceOpen]);
  return (
    <ListItemAllContainer
      onFocus={() => setOptionsOpen(true)}
      onMouseEnter={() => setOptionsOpen(true)}
      onMouseLeave={() => setOptionsOpen(false)}
      onAbort={() => setOptionsOpen(false)}
    >
      <ListItemContainer>
        {hasNested ? (
          <>
            {open ? (
              <Image
                alt="Opened icon"
                onClick={handleClick}
                src={Opened.src}
                width={6}
                height={6}
              />
            ) : (
              <Image
                alt="Closed icon"
                onClick={handleClick}
                src={Closed.src}
                width={6}
                height={6}
              />
            )}
          </>
        ) : (
          <div style={{ minWidth: '13px' }} />
        )}
        <ListItemText
          onClick={() => {
            if (openItem) openItem();
          }}
        >
          {children}
        </ListItemText>
        {hasNested ? <NestedCount>{nestedCount}</NestedCount> : <></>}
        {isLoading ? (
          <Status>
            <Spinner />{' '}
          </Status>
        ) : success ? (
          <Status>
            <SpinnerSuccess /> Successfully{' '}
          </Status>
        ) : error ? (
          <Status>
            {' '}
            <SpinnerError />{' '}
          </Status>
        ) : (
          <></>
        )}
        {optionsOpen ? (
          <Options>
            {onEdit && (
              <CanCall permission={edit_permission}>
                <ToolTip text={trans('Edit')}>
                  <Option
                    onClick={() => {
                      if (onEdit) onEdit();
                    }}
                  >
                    <Edit />
                  </Option>
                </ToolTip>
              </CanCall>
            )}
            {hasAddChild ? (
              <CanCall permission={add_permission}>
                <ToolTip text={trans('Add Sub')}>
                  <Option
                    onClick={() => {
                      if (addChild) addChild();
                    }}
                  >
                    <Add />
                  </Option>
                </ToolTip>
              </CanCall>
            ) : (
              <></>
            )}
            {hasDelete ? (
              <CanCall permission={delete_permission}>
                <ToolTip text={trans(deleteText)}>
                  <Option
                    onClick={() => {
                      if (onDelete) onDelete(); // Use onDelete
                    }}
                  >
                    <Delete />
                  </Option>
                </ToolTip>
              </CanCall>
            ) : (
              <></>
            )}
          </Options>
        ) : (
          <></>
        )}
      </ListItemContainer>
      <Collapse
        in={open}
        timeout="auto"
        unmountOnExit
        sx={{
          marginLeft: '26px',
          borderLeft: '1px solid #404040'
        }}
      >
        {nested}
      </Collapse>
    </ListItemAllContainer>
  );
}
