import SuspenseLoader from '@/components/SuspenseLoader';
import { useCheckUserNameMutation, User } from '@/services/auth';
import { SignUpProps } from '@/types/auth';
import EnterUser from '@/ui/icons/enterUser';
import { Box, styled } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';

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

function SignUp({
  setSignedIn,
  setCurrentUser,
  setResetPassword,
  setMissedPassword
}: SignUpProps) {
  const [name, setName] = useState('');
  const [checkusername, { isLoading: isCheckRunning }] =
    useCheckUserNameMutation();

  const check = async (name: string) => {
    const data: User = await checkusername(name).unwrap();
    if (data?.is_blocked_by_admin) {
      toast.error('the selected user is blocked by admin');
    } else if (data?.account_status === 'password_expired') {
      toast.error('the selected user password is expired');
      setCurrentUser(data);
      setResetPassword(true);
    } else if (data?.account_status === 'password_missed') {
      toast.error('the selected user password is missed');
      setCurrentUser(data);
      setMissedPassword(true);
    } else {
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(data));
      }
      setCurrentUser(data);
      setSignedIn(true);
    }
  };

  return (
    <SignUpWrapper>
      {isCheckRunning ? <SuspenseLoader /> : <></>}
      <SignUpBox>
        <RelativeInputParent>
          <div
            className={
              name.length ? 'user_colorable_mask_active' : 'user_colorable_mask'
            }
          />
          <UserNameInput
            disabled={isCheckRunning}
            value={name}
            onKeyDown={(e) => {
              if (e.code === 'Enter') check(name);
            }}
            onChange={(e) => setName(e.target.value)}
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
          {name.length > 0 ? (
            <div
              className="enter_user_name_button"
              onClick={() => {
                check(name);
              }}
            >
              <EnterUser />
            </div>
          ) : (
            <></>
          )}
        </RelativeInputParent>
        {/* <PinInputs value={pinValue} onChange={(value) => setPinValue(value)}
                    onComplete={async (value) => {
                        try {
                            const data = await login({ username: name, password: value }).unwrap()
                            document.querySelectorAll(".absolute-child").forEach((elem) => {
                                elem.classList.add("green-background");
                            });
                            if (typeof window !== 'undefined') {
                              localStorage.setItem("user", JSON.stringify(data.user))
                            }
                            dispatch(setCredentials(data))
                            navigate('/')
                        } catch (err) {
                            handleError()
                        }
                    }} disabled={false} /> */}
      </SignUpBox>
    </SignUpWrapper>
  );
}

export default SignUp;
