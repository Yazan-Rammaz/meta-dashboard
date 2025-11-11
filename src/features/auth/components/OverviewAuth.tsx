'use client';
import Login from '@/features/auth/components/LoginPage';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
// import SignUp from '@/features/auth/components/SignUpPage'; // This was commented out, so I'll just update the path in the comment.
import EnterPassWord from '@/features/auth/components/EnterPasswordPage';
import EnterToken from '@/features/auth/components/EnterTokenPage';
import SendToken from '@/features/auth/components/SendTokenPage';
import useTrans from '@/utils/translation_util';

function Overview() {
  const trans = useTrans();

  const [currentUser] = useState(
    typeof window !== 'undefined' && localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user') ?? '')
      : null
  );
  const [reset_password, setResetPassword] = useState(false);
  const [missedPassword, setMissedPassword] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>('');
  const [idToken, setIdToken] = useState('');

  useEffect(() => {
    // No longer setting signedIn state here, layout handles auth
    // If you need to perform actions based on user presence, do it in layout.tsx
  }, []);

  if (reset_password || missedPassword) {
    if (sessionToken && sessionToken.length > 0) {
      if (idToken.length > 0) {
        return (
          <>
            <Helmet>
              <title>{trans('Enter Password')}</title>
            </Helmet>
            <EnterPassWord
              id_token={idToken}
              user={currentUser}
              setMissedPassword={setMissedPassword}
              setResetPassword={setResetPassword}
              setSignedIn={() => {
                /* no longer needed */
              }}
            />
          </>
        );
      } else {
        return (
          <>
            <Helmet>
              <title>{trans('Enter Token')}</title>
            </Helmet>
            <EnterToken
              user={currentUser}
              session_token={sessionToken as string}
              setIdToken={setIdToken}
            />
          </>
        );
      }
    } else {
      return (
        <>
          <Helmet>
            <title>{trans('Reset Password')}</title>
          </Helmet>
          <SendToken
            user={currentUser}
            reset_password={reset_password}
            missedPassword={missedPassword}
            setSessionToken={setSessionToken}
          />
        </>
      );
    }
  }

  return (
    <>
      <Helmet>
        <title>{trans('login')}</title>
      </Helmet>
      <Login user={currentUser} />
    </>
  );
}

export default Overview;
