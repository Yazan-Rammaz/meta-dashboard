import { styled } from '@mui/material';

interface LoginOptionsProps {
    logout: () => void;
}

const OptionsContainer = styled('div')(
    () => `
    align-items: center;
    display: flex;
    justify-content: center;
    bottom: 0;
    position: absolute;
    width: 100%;
`,
);
const ClearLogin = styled('div')(
    () => `
    align-items: center;
    display: flex;
    justify-content: center;
    cursor: pointer;
`,
);
const ChangeUser = styled('div')(
    () => `
    align-items: center;
    display: flex;
    justify-content: center;
    margin-left: 30px;
    margin-right: 30px;
    cursor: pointer;
`,
);
const ForgetPassword = styled('div')(
    () => `
    align-items: center;
    display: flex;
    justify-content: center;
    cursor: pointer;
`,
);
const OptionText = styled('div')(
    () => `
    bottom: -19px;
    font-size: 10px;
    letter-spacing: .025em;
    opacity: 0;
    overflow: visible;
    overflow: initial;
    position: absolute;
    text-overflow: clip;
    white-space: nowrap;
    transition: .3s;
}
`,
);

function LoginOptions({ logout }: LoginOptionsProps) {
    return (
        <OptionsContainer>
            <ClearLogin className="clear_login_component" onClick={logout}>
                <div className="clear_login_icon" />
                <OptionText className="clear_login_text">{'Clear Login'}</OptionText>
            </ClearLogin>
            <ChangeUser className="change_user_component" onClick={logout}>
                <div className="change_user_icon" />
                <OptionText className="change_user_text">{'Change User'}</OptionText>
            </ChangeUser>
            <ForgetPassword className="forget_password_component">
                <div className="forget_password_icon" />
                <OptionText className="forget_password_text">{'Forget Password'}</OptionText>
            </ForgetPassword>
        </OptionsContainer>
    );
}

export default LoginOptions;
