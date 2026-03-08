import AddIcon from '@/ui/Modal/icons/addIcon';
import Close from '@/ui/Modal/icons/close';
import DeleteIcon from '@/ui/Modal/icons/deleteIcon';
import EditIcon from '@/ui/Modal/icons/editIcon';
import ResetIcon from '@/ui/Modal/icons/resetIcon';
import TopClearIcon from '@/ui/Modal/icons/topClearIcon';
import UploadExcel from '@/ui/Modal/icons/uploadExcel';
import ToolTip from '@/ui/Tooltip';
import CanCall from '@/utils/ability';
import { styled } from '@mui/material';
import { ReactElement } from 'react';

const HeaderContainer = styled('div')(
    () => `
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    height: 60px;
    width: 100%;
    flex-direction: column;
    -webkit-box-pack: justify;
    justify-content: center;
    padding: 0px 10px 0px 10px;
    flex-wrap: nowrap;
    background-color: #F4F4F4;
    box-shadow: 0px 2px 2px #0000000d;
`,
);
const HeaderRowContainer = styled('div')(
    () => `
    height: 30px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
`,
);
const HeaderTitle = styled('div')(
    () => `
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    color: #8E8E8E;
    font-size: 12px;
`,
);

const ModalCloseContainer = styled('div')(
    () => `
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;
    margin: 5px;
`,
);
const ActionIconContainer = styled('div')(
    () => `
    margin-right: 6px;
    height: 10px;
    width: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`,
);
const ExcelContainer = styled('div')(
    () => `
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    height: 14px;
    color: #A2A0A0;
    font-size: 10px;
    cursor: pointer;
`,
);
const ExcelIconContainer = styled('div')(
    () => `
    margin-right: 4px;
    height: 10px;
    width: 10px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

`,
);
const ClearDelete = styled('div')(
    () => `
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: fit-content;
`,
);
const AddClearDeleteExit = styled('div')(
    () => `
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: fit-content;
`,
);
const ClearDeleteExit = styled('div')(
    () => `
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: fit-content;
`,
);
const IconContainer = styled('div')(
    () => `
    height: 15px;
    width: 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 5px;
`,
);
const NavData = styled('div')(
    () => `
    display: flex;
    color: #6694FC;
    font-size: 10px;
    margin-left: 10px;
`,
);
interface ModalProps {
    icon?: ReactElement;
    title: string;
    close: () => void;
    edit?: () => void;
    Delete?: () => void;
    addChild?: () => void;
    mode: 'add' | 'update' | 'preview';
    hasAddSub?: boolean;
    navData?: string;
    clear_button_clk: () => void;
    add_permission?: string;
    update_permission?: string;
    delete_permission?: string;
}
export default function ModalHeader({
    icon,
    title,
    close,
    edit,
    Delete = () => {},
    mode,
    navData,
    clear_button_clk,
    addChild,
    hasAddSub,
    add_permission,
    delete_permission,
    update_permission,
}: ModalProps) {
    switch (mode) {
        case 'add':
            return (
                <HeaderContainer>
                    <HeaderRowContainer>
                        <HeaderTitle>
                            <ActionIconContainer>
                                <AddIcon />
                            </ActionIconContainer>
                            {'Add'} {title} {navData?.length ? <NavData>{navData}</NavData> : ''}
                        </HeaderTitle>
                        <ToolTip text={'Close'}>
                            <ModalCloseContainer onClick={() => close()}>
                                <Close />
                            </ModalCloseContainer>
                        </ToolTip>
                    </HeaderRowContainer>
                    <HeaderRowContainer>
                        <HeaderTitle>
                            <ExcelContainer>
                                <ExcelIconContainer>
                                    <UploadExcel />
                                </ExcelIconContainer>
                                {'Upload Xls'}
                            </ExcelContainer>
                        </HeaderTitle>
                        <ClearDelete>
                            <ToolTip text={'Delete'}>
                                <IconContainer
                                    onClick={() => {
                                        clear_button_clk();
                                    }}
                                >
                                    <DeleteIcon />
                                </IconContainer>
                            </ToolTip>
                            <ToolTip text={'Reset'}>
                                <IconContainer
                                    onClick={() => {
                                        clear_button_clk();
                                    }}
                                >
                                    <ResetIcon />
                                </IconContainer>
                            </ToolTip>
                        </ClearDelete>
                    </HeaderRowContainer>
                </HeaderContainer>
            );
        case 'update':
            return (
                <HeaderContainer>
                    <HeaderRowContainer>
                        <HeaderTitle>
                            {'Update'} {title} {navData?.length ? <NavData>{navData}</NavData> : ''}
                        </HeaderTitle>
                        <ToolTip text={'Close'}>
                            <ModalCloseContainer onClick={() => close()}>
                                <Close />
                            </ModalCloseContainer>
                        </ToolTip>
                    </HeaderRowContainer>
                    <HeaderRowContainer>
                        <HeaderTitle>
                            <ExcelContainer>
                                <ExcelIconContainer>
                                    <UploadExcel />
                                </ExcelIconContainer>
                                {'Upload Xls'}
                            </ExcelContainer>
                        </HeaderTitle>
                        <ClearDelete>
                            <ToolTip text={'Delete'}>
                                <IconContainer
                                    onClick={() => {
                                        clear_button_clk();
                                    }}
                                >
                                    <DeleteIcon />
                                </IconContainer>
                            </ToolTip>
                            <ToolTip text={'Reset'}>
                                <IconContainer
                                    onClick={() => {
                                        clear_button_clk();
                                    }}
                                >
                                    <ResetIcon />
                                </IconContainer>
                            </ToolTip>
                        </ClearDelete>
                    </HeaderRowContainer>
                </HeaderContainer>
            );
        case 'preview':
            return (
                <HeaderContainer>
                    <HeaderRowContainer>
                        <HeaderTitle>
                            {icon}
                            {title} {navData?.length ? <NavData>{navData}</NavData> : ''}
                        </HeaderTitle>
                        {hasAddSub ? (
                            <AddClearDeleteExit>
                                <CanCall permission={add_permission}>
                                    <ToolTip text={'Add Child'}>
                                        <ModalCloseContainer
                                            onClick={() => {
                                                if (addChild) addChild();
                                            }}
                                        >
                                            <AddIcon />
                                        </ModalCloseContainer>
                                    </ToolTip>
                                </CanCall>
                                <CanCall permission={delete_permission}>
                                    <ToolTip text={'Delete'}>
                                        <ModalCloseContainer
                                            onClick={() => {
                                                if (Delete) Delete();
                                            }}
                                        >
                                            <TopClearIcon />
                                        </ModalCloseContainer>
                                    </ToolTip>
                                </CanCall>
                                <CanCall permission={update_permission}>
                                    <ToolTip text={'Edit'}>
                                        <ModalCloseContainer
                                            onClick={() => {
                                                if (edit) edit();
                                            }}
                                        >
                                            <EditIcon />
                                        </ModalCloseContainer>
                                    </ToolTip>
                                </CanCall>
                                <ToolTip text={'Close'}>
                                    <ModalCloseContainer
                                        onClick={() => {
                                            if (close) close();
                                        }}
                                    >
                                        <Close />
                                    </ModalCloseContainer>
                                </ToolTip>
                            </AddClearDeleteExit>
                        ) : (
                            <ClearDeleteExit>
                                <CanCall permission={delete_permission}>
                                    <ToolTip text={'Delete'}>
                                        <ModalCloseContainer
                                            onClick={() => {
                                                if (Delete) Delete();
                                            }}
                                        >
                                            <TopClearIcon />
                                        </ModalCloseContainer>
                                    </ToolTip>
                                </CanCall>
                                <CanCall permission={update_permission}>
                                    <ToolTip text={'Edit'}>
                                        <ModalCloseContainer
                                            onClick={() => {
                                                if (edit) edit();
                                            }}
                                        >
                                            <EditIcon />
                                        </ModalCloseContainer>
                                    </ToolTip>
                                </CanCall>
                                <ToolTip text={'Close'}>
                                    <ModalCloseContainer
                                        onClick={() => {
                                            if (close) close();
                                        }}
                                    >
                                        <Close />
                                    </ModalCloseContainer>
                                </ToolTip>
                            </ClearDeleteExit>
                        )}
                    </HeaderRowContainer>
                </HeaderContainer>
            );
    }
}
