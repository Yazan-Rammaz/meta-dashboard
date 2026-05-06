export interface MetaAuthResponse {
    success: boolean;
    accountId?: string;
    phoneNumberId?: string;
    phoneNumber?: string;
    message?: string;
}

export interface FacebookSDKConfig {
    appId: string;
    configId: string;
    loginType: 'whatsapp' | 'meta';
}
