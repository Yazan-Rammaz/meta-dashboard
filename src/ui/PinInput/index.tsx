import { styled } from '@mui/material';
import PinInput from 'react-pin-input';

const PinContainer = styled('div')(
  () => `
    display: flex;
    align-items: center;
    position: relative;
    justify-content: center;
    margin-top: 20px;
`
);
const LocksContainer = styled('div')(
  () => `
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0px;
    left: 0px;
     z-index: 3;
`
);
const LockIcon = styled('div')(
  () => `
    margin-left: 10px;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgb(247, 247, 247);
    border-radius: 15px;
    padding: 1px;
`
);
interface PinInputsProps {
  value: string;
  onComplete: (value: string) => void;
  onChange: (value: string) => void;
  disabled: boolean;
}

function PinInputs({ value, onComplete, onChange, disabled }: PinInputsProps) {
  return (
    <PinContainer>
      <LocksContainer>
        {value.length > 0 && (
          <LockIcon className="absolute-child" sx={{ marginLeft: '0px' }}>
            <img alt="lock" src="/static/icons/signup/lock.svg" />
          </LockIcon>
        )}
        {value.length > 1 && (
          <LockIcon className="absolute-child">
            <img alt="lock" src="/static/icons/signup/lock.svg" />
          </LockIcon>
        )}
        {value.length > 2 && (
          <LockIcon className="absolute-child">
            <img alt="lock" src="/static/icons/signup/lock.svg" />
          </LockIcon>
        )}
        {value.length > 3 && (
          <LockIcon className="absolute-child">
            <img alt="lock" src="/static/icons/signup/lock.svg" />
          </LockIcon>
        )}
        {value.length > 4 && (
          <LockIcon className="absolute-child">
            <img alt="lock" src="/static/icons/signup/lock.svg" />
          </LockIcon>
        )}
        {value.length > 5 && (
          <LockIcon className="absolute-child">
            <img alt="lock" src="/static/icons/signup/lock.svg" />
          </LockIcon>
        )}
      </LocksContainer>
      <PinInput
        length={6}
        initialValue=""
        onChange={(value) => {
          onChange(value);
        }}
        type="numeric"
        disabled={disabled}
        inputMode="number"
        style={{
          marginTop: 0,
          width: 350,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          zIndex: 4
        }}
        onComplete={(value) => onComplete(value)}
        inputStyle={{
          borderRadius: 15,
          margin: 'initial',
          color: 'transparent',
          backgroundColor: 'transparent',
          border: '#ddddddc5 0.5px solid',
          width: 50,
          height: 50,
          userSelect: 'none',
          fontSize: '1px',
          overflow: 'visible',
          caretColor: '#404040'
        }}
        // onComplete={(value, index) => setPin(value)}
        autoSelect={true}
        regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}

        // disabled={disablePin}
      />
    </PinContainer>
  );
}

export default PinInputs;
