import { Box, styled } from '@mui/material';
import { useState } from 'react';
import PinInputs from '@/ui/PinInput';
import { useResetPasswordUsingOtpMutation } from '@/services/auth';
import AskForSend from '@/ui/icons/askforsend';
import { EnterPassWordProps } from '@/types/auth';

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

function EnterPassWord({
  user,
  id_token,
  setMissedPassword,
  setResetPassword,
  setSignedIn
}: EnterPassWordProps) {
  const [pinValue1, setPinValue1] = useState('');
  const [pinValue2, setPinValue2] = useState('');
  const [setPassword, { isLoading: isSetPasswordLoading }] =
    useResetPasswordUsingOtpMutation();

  const noMatchPassword = () => {
    const pinInput = document.querySelector('.pin-input');
    if (pinInput) {
      pinInput.classList.add('shake-modals');
    }
    document.querySelectorAll('.absolute-child').forEach((elem) => {
      elem.classList.add('red-background');
      elem.classList.remove('green-background');
    });

    setTimeout(() => {
      if (pinInput) {
        pinInput.classList.remove('shake-modals');
      }
      document.querySelectorAll('.absolute-child').forEach((elem) => {
        elem.classList.remove('red-background');
      });
    }, 400);

    setTimeout(() => {
      setPinValue1('');
      setPinValue2('');
    }, 400);
  };
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
  };

  return (
    <SignUpWrapper>
      <SignUpBox>
        <div style={{ minHeight: '253px' }} />
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
        <div className="reset_password_container_2">
          <div className="reset_password_container_main_icon">
            {' '}
            <AskForSend />
          </div>
          <div className="reset_password_container_main_welcome">
            Set Your Own Password
          </div>
        </div>
        <PinInputs
          value={pinValue1}
          onChange={(value: string) => setPinValue1(value)}
          onComplete={() => {}}
          disabled={isSetPasswordLoading}
        />
        <div className="reset_password_container_2">
          <div className="reset_password_container_main_welcome">
            Confirm Password
          </div>
        </div>
        <PinInputs
          value={pinValue2}
          onChange={(value: string) => setPinValue2(value)}
          onComplete={async (value: string) => {
            if (value === pinValue1) {
              try {
                await setPassword({
                  id_token: id_token,
                  password: value
                }).unwrap();
                document.querySelectorAll('.absolute-child').forEach((elem) => {
                  elem.classList.add('green-background');
                });
                setMissedPassword(false);
                setResetPassword(false);
                setSignedIn(true);
              } catch (_err) {
                handleError();
              }
            } else {
              noMatchPassword();
            }
          }}
          disabled={isSetPasswordLoading}
        />
      </SignUpBox>
    </SignUpWrapper>
  );
}

export default EnterPassWord;
