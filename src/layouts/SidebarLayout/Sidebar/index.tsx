import { SidebarContext } from '@/contexts/SidebarContext';
import { useContext } from 'react';

import { Divider, styled, useTheme } from '@mui/material';

import SidebarMenu from '@/layouts/SidebarLayout/Sidebar/SidebarMenu';

const SidebarWrapper = styled('div')(
  ({ theme }) => `
        color: ${theme.colors.alpha.trueWhite[70]};
        position: relative;
        z-index: 7;
        padding-bottom: 68px;
        background-color: #F7F7F7;
        box-shadow: 0px 3px 6px #00000010;
        border-radius: 10px;
`
);

function Sidebar() {
  const { sidebarToggle, openSidebar, closeSidebar } =
    useContext(SidebarContext);
  const theme = useTheme();

  return (
    <>
      <SidebarWrapper
        sx={{
          display: 'inline-block',
          position: 'fixed',
          left: 15,
          top: 90,
          bottom: 15,
          width: {
            xs: sidebarToggle ? '180px' : '50px'
          },
          transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onMouseEnter={() => openSidebar()}
        onMouseLeave={() => closeSidebar()}
      >
        <SidebarMenu />
        <Divider
          sx={{
            background: theme.colors.alpha.trueWhite[10]
          }}
        />
      </SidebarWrapper>
    </>
  );
}

export default Sidebar;
