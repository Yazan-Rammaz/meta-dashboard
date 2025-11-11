import { styled } from '@mui/material';
import { ReactElement } from 'react';
import RequiredDot from '@/ui/icons/requiredDot';

const BodyElements = styled('div')(
  () => `
        display: flex;
        flex-direction: row !important;
        align-items: flex-end;
        justify-content: flex-start;
        flex-wrap: wrap;
        width: 100%;
        font-size: 10px;
        color: #8e8e8e;
        margin-top: 12px;
    `
);
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
interface ModalSectionProps {
  title?: string;
  children: ReactElement;
  without_margin?: boolean;
  justify_between?: boolean;
  required?: boolean;
}
export default function ModalSectionVertical({
  title,
  children,
  without_margin,
  justify_between,
  required
}: ModalSectionProps) {
  return (
    <Body
      style={{
        marginTop: without_margin ? '0px' : '12px'
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
          justifyContent: justify_between ? 'space-between' : 'flex-start'
        }}
      >
        {children}
      </BodyElements>
    </Body>
  );
}
