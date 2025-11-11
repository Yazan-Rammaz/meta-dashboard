import {
  Box,
  alpha,
  Stack,
  lighten,
  Divider,
  styled,
  useTheme
} from '@mui/material';
import HeaderUserbox from '@/layouts/SidebarLayout/Header/Userbox';
import HeaderMenu from '@/layouts/SidebarLayout/Header/Menu';

const HeaderWrapper = styled(Box)(
  ({ theme }) => `
        height: ${theme.header.height};
        color: ${theme.header.textColor};
        margin: 20px 15px 20px 15px;
        right: 0;
        left: 0;
        z-index: 8;
        border-radius: 10px;
        box-shadow: 0 3px 6px rgba(0,0,0,.10196078431372549);
        background-color: ${alpha(theme?.header?.background ?? '', 0.95)};
        backdrop-filter: blur(3px);
        position: fixed;
        justify-content: space-between;
        @media (min-width: ${theme.breakpoints.values.lg}px) {
            left: 0;
            width: auto;
        }
`
);

function Header() {
  const theme = useTheme();

  return (
    <HeaderWrapper
      display="flex"
      alignItems="center"
      sx={{
        boxShadow:
          theme.palette.mode === 'dark'
            ? `0 1px 0 ${alpha(
                lighten(theme.colors.primary.main, 0.7),
                0.15
              )}, 0px 2px 8px -3px rgba(0, 0, 0, 0.2), 0px 5px 22px -4px rgba(0, 0, 0, .1)`
            : `0px 2px 8px -3px ${alpha(
                theme.colors.alpha.black[100],
                0.2
              )}, 0px 5px 22px -4px ${alpha(
                theme.colors.alpha.black[100],
                0.1
              )}`
      }}
    >
      <Box display="flex" alignItems="center">
        <HeaderUserbox />
      </Box>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        alignItems="center"
        spacing={1}
      >
        <HeaderMenu />
      </Stack>
    </HeaderWrapper>
  );
}

export default Header;
