import { styled } from '@mui/material';
import { ReactElement } from 'react';
import RequiredDot from '@/ui/icons/requiredDot';

const Title = styled('div')(
  () => `
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        font-size: 10px;
        letter-spacing: .025em;
        margin-left: 5px;
    `
);

const Body = styled('div')(
  () => `
        display: flex;
        flex-direction: column;
        width: 100%;
        justify-content: flex-start;
        margin-top: 12px;
        font-size: 10px;
        color: #8e8e8e;
        align-items: flex-start;
    `
);
const BodyElements = styled('div')(
  () => `
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
        justify-content: flex-start;
        font-size: 10px;
        color: #8e8e8e;
        align-items: flex-start;
    `
);
interface ModalSectionProps {
  title?: string;
  children: ReactElement;
  size?: number;
  justify?: 'start' | 'end' | 'center';
  without_margin?: boolean;
  required?: boolean;
  withBeginBorder?: boolean;
}
export default function ModalSection({
  title,
  children,
  size,
  justify,
  without_margin,
  required,
  withBeginBorder
}: ModalSectionProps) {
  return (
    <Body
      style={{
        width: size ? (size < 10 ? `${size}0%` : `${size}%`) : '400px',
        marginTop: without_margin ? '0px' : '12px',
        borderLeft: withBeginBorder
          ? '.5px solid hsla(0, 1%, 80.6%, .7607843137254902)'
          : 'none'
      }}
    >
      {title ? (
        <Title>
          {required ? <RequiredDot /> : ''} {title}
        </Title>
      ) : (
        <></>
      )}
      <BodyElements
        style={{
          justifyContent: justify ? justify : 'flex-start'
        }}
      >
        {children}
      </BodyElements>
    </Body>
  );
}
