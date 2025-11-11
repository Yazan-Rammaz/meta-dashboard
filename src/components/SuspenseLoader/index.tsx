import { useEffect } from 'react';
import NProgress from 'nprogress';
import { Box, CircularProgress } from '@mui/material';

function SuspenseLoader() {
  useEffect(() => {
    NProgress.start();

    return () => {
      NProgress.done();
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: 999900009
      }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={999900009}
    >
      <CircularProgress size={30} disableShrink thickness={2} color='info' />
    </Box>
  );
}

export default SuspenseLoader;
