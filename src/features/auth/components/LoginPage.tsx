import { setCredentials } from '@/features/auth/authSlice';
import { useLoginMutation } from '@/services/auth';
import Button from '@/ui/Button/modalActionButton';
import { Box, styled } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
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
const UserImage = styled('img')(
  () => `
    top: 15px;
    left: 15px;
    position: absolute;
    z-index: 9999;
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
const PasswordInput = styled('input')(
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
    margin: 5px;
`
);

interface AuthError {
  status: number;
  data: { message: string };
}

interface LoginProps {
  user: { id?: string; email?: string };
}

function LogIn({ user }: LoginProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const handleError = (err?: AuthError) => {
    document.querySelectorAll('.absolute-child').forEach((elem) => {
      elem.classList.add('red-background');
    });
    if (err?.data?.message) {
      toast.error(err.data.message);
    } else {
      toast.error('An unexpected error occurred.');
    }
  };
  useEffect(() => {
    if (user?.id) {
      setEmail(user.email || '');
    }
  }, [user?.id, user?.email]); // Added user.id and user.email to dependency array
  return (
    <SignUpWrapper>
      <SignUpBox>
        <RelativeInputParent>
          <UserImage alt="user" src="/static/icons/signup/user.svg" />
          <UserNameInput
            disabled={false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
          />
        </RelativeInputParent>
        <RelativeInputParent>
          <UserImage alt="user" src="/static/icons/signup/user.svg" />
          <PasswordInput
            disabled={false}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            onKeyDown={async (e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                try {
                  const data = await login({ email, password }).unwrap();
                  document
                    .querySelectorAll('.absolute-child')
                    .forEach((elem) => {
                      elem.classList.add('green-background');
                    });
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('user', JSON.stringify(data.user));
                  }
                  dispatch(
                    setCredentials({
                      user: data.user,
                      access_token: data.access_token
                    })
                  );
                  router.push('/');
                } catch (err: unknown) {
                  if (
                    typeof err === 'object' &&
                    err !== null &&
                    'status' in err &&
                    'data' in err
                  ) {
                    handleError(err as AuthError);
                  } else {
                    handleError(); // Generic error handling
                  }
                }
              }
            }}
          />
        </RelativeInputParent>
        <Button
          text="Log in"
          onClick={async () => {
            try {
              const data = await login({ email, password }).unwrap();
              document.querySelectorAll('.absolute-child').forEach((elem) => {
                elem.classList.add('green-background');
              });
              if (typeof window !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(data.user));
              }
              dispatch(
                setCredentials({
                  user: data.user,
                  access_token: data.access_token
                })
              );
              router.push('/');
            } catch (err: unknown) {
              if (
                typeof err === 'object' &&
                err !== null &&
                'status' in err &&
                'data' in err
              ) {
                handleError(err as AuthError);
              } else {
                handleError(); // Generic error handling
              }
            }
          }}
          disabled={!email || !password || isLoading}
        />
      </SignUpBox>
    </SignUpWrapper>
  );
}

export default LogIn;
