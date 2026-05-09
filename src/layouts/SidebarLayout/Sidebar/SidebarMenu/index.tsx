import { SidebarContext } from '@/contexts/SidebarContext';
import OpenMenuSVG from '@/layouts/SidebarLayout/Sidebar/SidebarMenu/sidebaropen.svg';
import { PAGE_PERMISSIONS } from '@/types/permissions';
import DocsIcon from '@/ui/icons/Docs';
import HomeIcon from '@/ui/icons/home.svg';
import HRMIcon from '@/ui/icons/HRM.svg';
import InfoIcon from '@/ui/icons/Info';
import LinksIcon from '@/ui/icons/Links';
import UsersIcon, { default as ClientsIcon } from '@/ui/icons/user.svg'; // Import the new UsersIcon
import CanCall from '@/utils/ability';
import { styled } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { JSX, useContext } from 'react';

const MenuWrapper = styled('div')(
    ({ theme }) => `
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  
  .MuiList-root {
    padding: ${theme.spacing(1)};

    & > .MuiList-root {
      padding: 0 ${theme.spacing(0)} ${theme.spacing(1)};
    }
  }

    .MuiListSubheader-root {
    align-items: center;
    color: #d1d1d1;
    display: flex;
    font-size: 14px;
    justify-content: flex-start;
    letter-spacing: .5px;
    line-height: 14px;
    text-align: start;
    width: -webkit-fill-available;
    }
`,
);
const LinkButton = styled(Link, {
    shouldForwardProp: (prop) => !(typeof prop === 'string' && prop.startsWith('$')),
})<{
    $sidebarToggle?: boolean;
    $isActive?: boolean;
}>(
    ({ $sidebarToggle, $isActive }) => `
    margin-bottom: 8px;
    margin-left: ${$sidebarToggle ? '12px' : '0'};
    margin-right: ${$sidebarToggle ? '12px' : '0'};
    padding: ${$sidebarToggle ? '12px 16px' : '12px 8px'};
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: ${$sidebarToggle ? 'flex-start' : 'center'};
    cursor: pointer;
    text-decoration: none;
    border-radius: 8px;
    background-color: ${$isActive ? 'rgba(64, 64, 64, 0.1)' : 'transparent'};
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    width: ${$sidebarToggle ? 'calc(100% - 24px)' : '100%'};
    max-width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    
    &:hover {
      background-color: ${$isActive ? 'rgba(64, 64, 64, 0.15)' : 'rgba(64, 64, 64, 0.08)'};
      transform: translateX(${$sidebarToggle ? '2px' : '0'});
    }
    
    &:active {
      transform: translateX(${$sidebarToggle ? '1px' : '0'}) scale(0.98);
    }
  `,
);
const LinkButtonText = styled('div', {
    shouldForwardProp: (prop) => !(typeof prop === 'string' && prop.startsWith('$')),
})<{ $sidebarToggle?: boolean }>(
    ({ $sidebarToggle }) => `
    font-size: 14px;
    font-weight: 500;
    width: fit-content;
    color: inherit;
    line-height: 1.4;
    letter-spacing: 0.3px;
    text-align: start;
    display: ${$sidebarToggle ? 'flex' : 'none'};
    align-items: center;
    justify-content: flex-start;
    white-space: nowrap;
    opacity: ${$sidebarToggle ? '1' : '0'};
    transform: ${$sidebarToggle ? 'translateX(0)' : 'translateX(-10px)'};
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1) ${$sidebarToggle ? '0.1s' : '0s'}, 
                transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) ${$sidebarToggle ? '0.1s' : '0s'};
    pointer-events: ${$sidebarToggle ? 'auto' : 'none'};
    width: ${$sidebarToggle ? 'fit-content' : '0'};
    overflow: hidden;
  `,
);
const SubMenuWrapper = styled('div')(
    ({ theme }) => `
    padding: 0;
    overflow: visible;
    width: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    
    .MuiList-root {

      .MuiListItem-root {
        padding: 1px 0;

        .MuiBadge-root {
          position: absolute;
          right: ${theme.spacing(3.2)};

          .MuiBadge-standard {
            background: ${theme.colors.primary.main};
            font-size: ${theme.typography.pxToRem(10)};
            font-weight: normal;
            text-transform: uppercase;
            color: ${theme.palette.primary.contrastText};
          }
        }
    
        .MuiButton-root {
         align-items: center;
    color: #d1d1d1;
    display: flex;
    font-size: 14px;
    justify-content: flex-start;
    letter-spacing: .5px;
    line-height: 14px;
    text-align: start;
    width: -webkit-fill-available;

          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(['color'])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            color: ${theme.colors.alpha.black[30]};
            font-size: ${theme.typography.pxToRem(20)};
            margin-right: ${theme.spacing(1)};
          }
          
          .MuiButton-endIcon {
            color: ${theme.colors.alpha.black[50]};
            margin-left: auto;
            opacity: .8;
            font-size: ${theme.typography.pxToRem(20)};
          }

          &.active,
          &:hover {
            background-color: transparent;
            color: #5d5d5d;
            transition: .3s;
            margin-left: 5px;
            .MuiButton-startIcon,
            .MuiButton-endIcon {
              color: #5d5d5d;
            }
          }
        }

        &.Mui-children {
          flex-direction: column;

          .MuiBadge-root {
            position: absolute;
            right: ${theme.spacing(7)};
          }
        }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: ${theme.spacing(1, 0)};
          }

          .MuiListItem-root {
            padding: 1px 0;

            .MuiButton-root {
              padding: ${theme.spacing(0.8, 3)};

              .MuiBadge-root {
                right: ${theme.spacing(3.2)};
              }

              &:before {
                content: ' ';
                background: ${theme.colors.alpha.black[100]};
                opacity: 0;
                transition: ${theme.transitions.create(['transform', 'opacity'])};
                width: 6px;
                height: 6px;
                transform: scale(0);
                transform-origin: center;
                border-radius: 20px;
                margin-right: ${theme.spacing(1.8)};
              }

              &.active,
              &:hover {

                &:before {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }
`,
);

interface SidebarMenuItemData {
    link: string;
    id: number;
    label: string;
    icon: { src: string } | string | React.ComponentType<any>;
    permission?: string;
}

interface SidebarMenuItemProps {
    item: SidebarMenuItemData;
    renderIcon: (
        IconComponent: { src: string } | string | React.ComponentType<any>,
        active: boolean,
        id: number,
    ) => JSX.Element;
    sidebarToggle: boolean;
    isActive: boolean;
}

function SidebarMenuItem({ item, renderIcon, sidebarToggle, isActive }: SidebarMenuItemProps) {
    const menuItem = (
        <LinkButton
            href={item.link}
            $sidebarToggle={sidebarToggle}
            $isActive={isActive}
            style={{
                color: isActive ? '#404040' : '#8E8E8E',
            }}
        >
            {renderIcon(item.icon, isActive, item.id)}
            <LinkButtonText $sidebarToggle={sidebarToggle}>{item.label}</LinkButtonText>
        </LinkButton>
    );

    if (item.permission) {
        return <CanCall permission={item.permission}>{menuItem}</CanCall>;
    }

    return menuItem;
}

function SidebarMenu() {
    const { sidebarToggle, toggleSidebar, closeSidebar } = useContext(SidebarContext);
    const pathname = usePathname();

    const renderIcon = (
        IconComponent: { src: string } | string | React.ComponentType<any>,
        active: boolean,
        id: number,
    ) => {
        if (typeof IconComponent === 'function') {
            const Icon = IconComponent;
            return (
                <div
                    style={{
                        width: '22px',
                        height: '22px',
                        marginRight: sidebarToggle ? '12px' : '0',
                        marginLeft: sidebarToggle ? '0' : '0',
                        padding: sidebarToggle ? '0' : '4px',
                        minWidth: '22px',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: active ? 'scale(1.05)' : 'scale(1)',
                        opacity: 1,
                        visibility: 'visible',
                        color: active ? '#404040' : '#A2A0A0',
                    }}
                >
                    <Icon />
                </div>
            );
        }

        const imageUrl = typeof IconComponent === 'string' ? IconComponent : IconComponent.src;
        return (
            <div
                style={{
                    width: '22px',
                    height: '22px',
                    marginRight: sidebarToggle ? '12px' : '0',
                    marginLeft: sidebarToggle ? '0' : '0',
                    padding: sidebarToggle ? '0' : '4px',
                    minWidth: '22px',
                    flexShrink: 0,
                    display: 'block',
                    WebkitMask: `url(${imageUrl}) no-repeat center`,
                    mask: `url(${imageUrl}) no-repeat center`,
                    maskSize: 'contain',
                    WebkitMaskSize: 'contain',
                    backgroundColor: active ? '#404040' : '#A2A0A0',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: active ? 'scale(1.05)' : 'scale(1)',
                    opacity: 1,
                    visibility: 'visible',
                }}
            />
        );
    };

    const menuItems: SidebarMenuItemData[] = [
        {
            link: '/',
            id: 1,
            label: 'Dashboard',
            icon: HomeIcon,
            permission: PAGE_PERMISSIONS.DASHBOARD,
        },
        {
            link: '/roles',
            id: 2,
            label: 'Roles',
            icon: HRMIcon,
            permission: '', // PAGE_PERMISSIONS.ROLES
        },
        {
            link: '/api-keys',
            id: 3,
            label: 'API Keys',
            icon: LinksIcon,
            permission: PAGE_PERMISSIONS.API_KEYS,
        },
        {
            link: '/clients',
            id: 4,
            label: 'Clients',
            icon: ClientsIcon,
            permission: PAGE_PERMISSIONS.CLIENTS,
        },
        {
            link: '/messages',
            id: 5,
            label: 'Messages',
            icon: DocsIcon,
            permission: PAGE_PERMISSIONS.MESSAGES,
        },
        {
            link: '/users',
            id: 6,
            label: 'Users',
            icon: UsersIcon,
            permission: PAGE_PERMISSIONS.USERS,
        },
        {
            link: '/templates',
            id: 8,
            label: 'Templates',
            icon: DocsIcon,
            permission: PAGE_PERMISSIONS.TEMPLATES,
        },
        {
            link: '/webhooks',
            id: 7,
            label: 'Webhooks',
            icon: InfoIcon,
            permission: PAGE_PERMISSIONS.WEBHOOKS,
        },
        {
            link: '/integrations',
            id: 9,
            label: 'Integration',
            icon: LinksIcon,
            permission: '', // No backend permission required yet
        },
    ];

    const isActive = (link: string) => {
        if (link === '/') {
            return pathname === '/' || pathname === '';
        }
        return pathname === link || pathname?.startsWith(link + '/');
    };

    return (
        <>
            <MenuWrapper>
                <div style={{ width: '100%', boxSizing: 'border-box' }}>
                    <div
                        onClick={toggleSidebar}
                        style={{
                            width: '32px',
                            height: '32px',
                            marginLeft: sidebarToggle ? '12px' : '9px',
                            marginTop: '20px',
                            marginBottom: '30px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '8px',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            backgroundColor: 'transparent',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(64, 64, 64, 0.08)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        <Image
                            src={OpenMenuSVG.src}
                            alt="Toggle menu icon"
                            width={20}
                            height={20}
                            style={{
                                transform: sidebarToggle ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                        />
                    </div>
                    <SubMenuWrapper
                        style={{
                            alignItems: sidebarToggle ? 'stretch' : 'center',
                            width: '100%',
                            boxSizing: 'border-box',
                        }}
                    >
                        {menuItems.map((item) => (
                            <SidebarMenuItem
                                key={item.id}
                                item={item}
                                renderIcon={renderIcon}
                                sidebarToggle={sidebarToggle}
                                isActive={isActive(item.link)}
                            />
                        ))}
                    </SubMenuWrapper>
                </div>
            </MenuWrapper>
        </>
    );
}

export default SidebarMenu;
