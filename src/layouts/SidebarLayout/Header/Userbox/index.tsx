'use client';

import { Avatar, Box, Button, lighten, Popover, Typography, useMediaQuery } from '@mui/material';
import { useContext, useRef, useState } from 'react';

import { TranslationContext } from '@/contexts/appLangContext';
import { useAuth } from '@/hooks/useAuth';
import { Lock } from '@mui/icons-material';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import { styled } from '@mui/material/styles';

const MenuUserBox = styled(Box)(
    ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`,
);

const UserBoxText = styled(Box)(
    ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`,
);

const UserBoxLabel = styled(Typography)(
    ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`,
);

const UserBoxDescription = styled(Typography)(
    ({ theme }) => `
        color: ${lighten(theme.palette.secondary.main, 0.5)}
`,
);

function HeaderUserbox() {
    const { user } = useAuth();
    const isMdDown = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
    const isSmDown = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

    const ref = useRef<HTMLButtonElement | null>(null);
    const [isOpen, setOpen] = useState<boolean>(false);

    const handleOpen = (): void => {
        setOpen(true);
    };

    const handleClose = (): void => {
        setOpen(false);
    };
    const { language_code, changeLanguage } = useContext(TranslationContext);
    return (
        <>
            <Button color="secondary" ref={ref} onClick={handleOpen} sx={{ padding: '0px' }}>
                <Avatar
                    variant="rounded"
                    alt={user?.name}
                    src={''}
                    sx={{ width: 50, height: 50 }}
                />
                {!isMdDown && (
                    <UserBoxText>
                        <UserBoxLabel variant="body1">{user?.name}</UserBoxLabel>
                    </UserBoxText>
                )}
                {!isSmDown && <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />}
            </Button>
            <Popover
                anchorEl={ref.current}
                onClose={handleClose}
                open={isOpen}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuUserBox sx={{ minWidth: 210 }} display="flex">
                    <Avatar variant="rounded" alt={user?.name} src={''} />
                    <UserBoxText>
                        <UserBoxLabel variant="body1">{user?.name}</UserBoxLabel>
                        <UserBoxDescription variant="body2">{user?.role}</UserBoxDescription>
                    </UserBoxText>
                </MenuUserBox>
                <Box sx={{ m: 1 }}>
                    <Button
                        color="primary"
                        fullWidth
                        onClick={() => {
                            window.location.reload();
                        }}
                    >
                        <Lock sx={{ mr: 1 }} />
                        {'Lock'}
                    </Button>
                </Box>
                <Box sx={{ m: 1 }}>
                    <Button
                        color="secondary"
                        fullWidth
                        onClick={() => {
                            if (typeof window !== 'undefined') {
                                localStorage.setItem('user', 'null');
                            }
                            window.location.reload();
                        }}
                    >
                        <LockOpenTwoToneIcon sx={{ mr: 1 }} />
                        SignOut
                    </Button>
                </Box>
            </Popover>
        </>
    );
}

export default HeaderUserbox;
