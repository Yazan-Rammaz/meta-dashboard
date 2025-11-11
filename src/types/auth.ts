import { User } from '@/services/auth';

export interface EnterTokenProps {
  user: { username: string; masked_email?: string };
  session_token: string;
  setIdToken: (token: string) => void;
}

export interface EnterOtpTokenResponse {
  message: string;
  id_token?: string;
}

export interface SendTokenProps {
  user: { username: string; full_name?: string; masked_mobile_phone?: string };
  reset_password: boolean;
  missedPassword: boolean;
  setSessionToken: (token: string | null) => void;
}

export interface SignUpProps {
  setSignedIn: (signedIn: boolean) => void;
  setCurrentUser: (user: User | null) => void;
  setResetPassword: (reset: boolean) => void;
  setMissedPassword: (missed: boolean) => void;
}

export interface EnterPassWordProps {
  user: { username: string };
  id_token: string;
  setMissedPassword: (missed: boolean) => void;
  setResetPassword: (reset: boolean) => void;
  setSignedIn: (signedIn: boolean) => void;
}
