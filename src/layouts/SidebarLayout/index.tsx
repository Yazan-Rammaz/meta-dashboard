import { FC, ReactNode } from 'react';
import { Box, alpha, lighten, useTheme } from '@mui/material';
import { useContext } from 'react';
import Sidebar from '@/layouts/SidebarLayout/Sidebar';
import Header from '@/layouts/SidebarLayout/Header';
import Scrollbar from '@/components/Scrollbar';
import { SidebarContext } from '@/contexts/SidebarContext';
import { Helmet } from 'react-helmet-async';
import useTrans from '@/utils/translation_util';
interface SidebarLayoutProps {
  children?: ReactNode;
}

const SidebarLayout: FC<SidebarLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const { sidebarToggle } = useContext(SidebarContext);
  return (
    <>
      <Helmet>
        <title>{useTrans()('home')}</title>
      </Helmet>
      <Box
        sx={{
          flex: 1,
          height: '100%',
          '.MuiPageTitle-wrapper': {
            background:
              theme.palette.mode === 'dark'
                ? theme.colors.alpha.trueWhite[5]
                : theme.colors.alpha.white[50],
            marginBottom: `${theme.spacing(4)}`,
            boxShadow:
              theme.palette.mode === 'dark'
                ? `0 1px 0 ${alpha(
                    lighten(theme.colors.primary.main, 0.7),
                    0.15
                  )}, 0px 2px 4px -3px rgba(0, 0, 0, 0.2), 0px 5px 12px -4px rgba(0, 0, 0, .1)`
                : `0px 2px 4px -3px ${alpha(
                    theme.colors.alpha.black[100],
                    0.1
                  )}, 0px 5px 12px -4px ${alpha(
                    theme.colors.alpha.black[100],
                    0.05
                  )}`
          }
        }}
      >
        <Header />
        <Sidebar />
        <Box
          id="body_super_parent"
          sx={{
            position: 'relative',
            zIndex: 5,
            display: 'block',
            flex: 1,
            mt: `90px`,
            height: 'calc(100vh - 110px)',
            overflow: 'auto',
            width: sidebarToggle ? 'calc(100vw - 190px)' : 'calc(100vw - 90px)',
            marginLeft: sidebarToggle ? '175px' : '75px'
          }}
        >
          <Scrollbar>
            <Box display="block">{children}</Box>
          </Scrollbar>
        </Box>
      </Box>
    </>
  );
};

export default SidebarLayout;
