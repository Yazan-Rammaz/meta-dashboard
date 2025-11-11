import LogoInner from '@/components/LogoSign/logoInner';
import { Box, Tooltip, styled } from '@mui/material';
import Link from 'next/link';
import { lighten } from 'polished';

const LogoWrapper = styled(Box)(
  () => `
          background: ${lighten(0.05, '#223354')};
          padding: 0px;
          margin: 0px
`
);

// const TooltipWrapper = styled(({ className, ...props }: TooltipProps) => (
//   <Tooltip {...props} classes={{ popper: className }} />
// ))(({ theme }) => ({
//   [`& .${tooltipClasses.tooltip}`]: {
//     backgroundColor: theme.colors.alpha.trueWhite[100],
//     color: theme.palette.getContrastText(theme.colors.alpha.trueWhite[100]),
//     fontSize: theme.typography.pxToRem(12),
//     fontWeight: 'normal',
//     borderRadius: theme.general.borderRadiusSm,
//     boxShadow:
//       '0 .2rem .8rem rgba(7,9,25,.18), 0 .08rem .15rem rgba(7,9,25,.15)'
//   },
//   [`& .${tooltipClasses.arrow}`]: {
//     color: theme.colors.alpha.trueWhite[100]
//   }
// }));

interface HeaderLogoProps {
  id?: string;
  name?: string;
}

function Logo() {
  return (
    <Tooltip arrow title="Meta Whatsapp Admin Dashboard">
      <Link href="/" passHref>
        <LogoWrapper>
          <LogoInner />
        </LogoWrapper>
      </Link>
    </Tooltip>
  );
}

export default Logo;
