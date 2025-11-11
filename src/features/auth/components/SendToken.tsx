'use client';

import { Box, styled } from '@mui/material';
import { useSendOtpTokenMutation } from '@/services/auth';
import SuspenseLoader from '@/components/SuspenseLoader';
import AskForSend from '@/ui/icons/askforsend';
import { SendTokenProps } from '@/types/auth';

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
    background-color: #FFFFFF;
    border: .5px solid #DDDDDD;
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

function SendToken({
  user,
  reset_password,
  missedPassword,
  setSessionToken
}: SendTokenProps) {
  const [sendOtp, { isLoading: isSendOtpLoading }] = useSendOtpTokenMutation();
  const handleSendCodeByEmail = async (username: string) => {
    const data = await sendOtp(username).unwrap();
    setSessionToken(data.message); // This line was manually corrected by the user in the previous step
  };
  return (
    <SignUpWrapper>
      {isSendOtpLoading ? <SuspenseLoader /> : <></>}
      <SignUpBox>
        <div style={{ minHeight: '220px' }} />
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
        <div className="reset_password_container">
          <div className="reset_password_container_main_icon">
            {' '}
            <AskForSend />
          </div>
          <div className="reset_password_container_main_welcome">
            {' '}
            <div className="reset_password_container_main_welcome_user">
              Welcome {user?.full_name}{' '}
            </div>{' '}
            {missedPassword ? 'To Our Team' : ''}
          </div>
          <div className="reset_password_container_main_welcome">
            To {reset_password ? 'Reset' : 'Set'} Your Own Password We Will Send
            A Verification Code To Your Number Registered In The System
          </div>
          <div className="reset_password_container_main_welcome">
            “{user?.masked_mobile_phone}“
          </div>
          {isSendOtpLoading ? (
            <div className="reset_password_container_main_welcome_send">
              sending ...
            </div>
          ) : (
            <div
              className="reset_password_container_main_welcome_send"
              onClick={() => {
                handleSendCodeByEmail(user.username);
              }}
            >
              send
            </div>
          )}
        </div>
      </SignUpBox>
    </SignUpWrapper>
  );
}

export default SendToken;
