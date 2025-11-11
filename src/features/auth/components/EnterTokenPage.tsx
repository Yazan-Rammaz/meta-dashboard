import { Box, styled } from '@mui/material';
import { useState } from 'react';
import PinInputs from '@/ui/PinInput';
import { useEnterOtpTokenMutation } from '@/services/auth';
import AskForSend from '@/ui/icons/askforsend';
import { EnterTokenProps, EnterOtpTokenResponse } from '@/types/auth';

const SignUpWrapper = styled(Box)(
  () => `
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`
);
const SignUpBox = styled(Box)(
  () => `
    width: 100%;
    height: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: relative;
`
);

const UserNameInput = styled('input')(
  () => `
    background-color: #f7f7f7;
    border: .5px solid hsla(0, 0%, 86.7%, .7725490196078432);
    border-radius: 15px;
    font-size: 18px;
    font-family: "SF-Pro-Rounded";
    outline: none;
    text-align: center;
    color: #8e8e8e;
    height: 50px;
    width: 100%;
    letter-spacing: .025em;
    display: flex;
    align-items: center;
    justify-content: center;
`
);

const RelativeInputParent = styled('div')(
  () => `
    position: relative;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 410px;
    width: 100%;
`
);

function EnterToken({ user, session_token, setIdToken }: EnterTokenProps) {
  const [pinValue, setPinValue] = useState('');
  const [check, { isLoading: isCheckLoading }] = useEnterOtpTokenMutation();

  const handleError = () => {
    document.querySelectorAll('.absolute-child').forEach((elem) => {
      elem.classList.add('red-background');
      elem.classList.remove('green-background');
    });
    setTimeout(() => {
      document.querySelectorAll('.absolute-child').forEach((elem) => {
        elem.classList.remove('red-background');
      });
    }, 900);
    setPinValue('');
  };

  return (
    <SignUpWrapper>
      <SignUpBox>
        <div style={{ minHeight: '138px' }} />
        <RelativeInputParent>
          <div
            className={
              user.username.length
                ? 'user_colorable_mask_active'
                : 'user_colorable_mask'
            }
          />
          <UserNameInput
            disabled={true}
            value={user.username}
            placeholder="User Name"
            sx={{
              '::placeholder': {
                color: '#DDDDDD'
              },
              ':disabled': {
                backgroundColor: '#F7F7F7'
              }
            }}
          />
        </RelativeInputParent>
        <PinInputs
          value={pinValue}
          onChange={(value: string) => setPinValue(value)}
          onComplete={async (value: string) => {
            try {
              const data: EnterOtpTokenResponse = await check({
                session_token: session_token,
                token: value,
                username: user.username
              }).unwrap();
              document.querySelectorAll('.absolute-child').forEach((elem) => {
                elem.classList.add('green-background');
              });
              console.log(data);
              setIdToken(data?.id_token || '');
            } catch (_err) {
              handleError();
            }
          }}
          disabled={isCheckLoading}
        />
        <div className="reset_password_container_2">
          <div className="reset_password_container_main_icon">
            {' '}
            <AskForSend />
          </div>
          <div className="reset_password_container_main_welcome">
            Please Enter The Verification Code Sent To “ {user?.masked_email} “
          </div>
        </div>
      </SignUpBox>
    </SignUpWrapper>
  );
}

export default EnterToken;
