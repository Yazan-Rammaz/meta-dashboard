import { Box, List, ListItem, ListItemIcon } from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import Image from 'next/image';

const ListWrapper = styled(Box)(
  ({ theme }) => `
        .MuiTouchRipple-root {
            display: none;
        }
        .MuiListItem-root {
            transition: ${theme.transitions.create(['color', 'fill'])};
            &.MuiListItem-indicators {
                padding: 5px;
            
                .MuiListItemText-root {
                    .MuiTypography-root {
                        &:before {
                            height: 4px;
                            width: 22px;
                            opacity: 0;
                            visibility: hidden;
                            display: block;
                            position: absolute;
                            bottom: -10px;
                            transition: all .2s;
                            border-radius: ${theme.general.borderRadiusLg};
                            content: "";
                            background: ${theme.colors.primary.main};
                        }
                    }
                }
                &.active,
                &:active,
                &:hover {
                    background: transparent;
                    .MuiListItemText-root {
                        .MuiTypography-root {
                            &:before {
                                opacity: 1;
                                visibility: visible;
                                bottom: 0px;
                            }
                        }
                    }
                }
            }
        }
`
);

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

function HeaderMenu() {
  return (
    <>
      <ListWrapper
        sx={{
          display: {
            xs: 'none',
            md: 'block'
          }
        }}
      >
        <List disablePadding component={Box} display="flex">
          <ListItem
            classes={{ root: 'MuiListItem-indicators' }}
            component={Link}
            href="#"
          >
            <ListItemIcon sx={{ minWidth: '20px', marginRight: '10px' }}>
              <Image
                alt="notifications"
                src="/static/icons/header/notification.svg"
                width={20}
                height={20}
              />
            </ListItemIcon>
          </ListItem>
          <ListItem
            classes={{ root: 'MuiListItem-indicators' }}
            component={Link}
            href="#"
          >
            <ListItemIcon sx={{ minWidth: '20px', marginRight: '10px' }}>
              <Image
                alt="notifications"
                src="/static/icons/header/chat.svg"
                width={20}
                height={20}
              />
            </ListItemIcon>
          </ListItem>
        </List>
      </ListWrapper>
    </>
  );
}

export default HeaderMenu;
