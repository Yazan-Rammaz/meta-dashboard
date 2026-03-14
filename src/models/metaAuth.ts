export interface MetaAuthResponse {
    access_token: string;
    whatsapp_business_id: string;
    phone_number_id: string;
    display_phone_number: string;
}

export interface FacebookSDKConfig {
    appId: string;
    configId: string;
    loginType: 'whatsapp' | 'meta';
}
