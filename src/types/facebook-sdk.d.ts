declare namespace fb {
    interface AuthResponse {
        code?: string;
        accessToken?: string;
        userID?: string;
        expiresIn?: number;
        signedRequest?: string;
        graphDomain?: string;
        data_access_expiration_time?: number;
    }

    interface StatusResponse {
        status?: string;
        authResponse?: AuthResponse;
    }

    interface LoginOptions {
        scope?: string;
        return_scopes?: boolean;
        auth_type?: string;
        config_id?: string;
        response_type?: string;
        override_default_response_type?: boolean;
    }
}

interface FacebookSDK {
    init(options: { appId: string; cookie?: boolean; xfbml?: boolean; version: string }): void;
    login(callback: (response: fb.StatusResponse) => void, options?: fb.LoginOptions): void;
}

declare var FB: FacebookSDK | undefined;

interface Window {
    fbAsyncInit?: () => void;
}
