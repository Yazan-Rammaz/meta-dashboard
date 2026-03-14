export interface Template {
    id: string;
    whatsapp_id?: string;
    client_id: string;
    name: string;
    category: 'AUTHENTICATION' | 'MARKETING' | 'UTILITY';
    language: string;
    status: string;
    parameter_format: 'named' | 'positional';
    components: TemplateComponent[];
    quality_rating?: string;
    send_to_meta: boolean;
    created_at?: string;
    updated_at?: string;
}

export type TemplateComponent =
    | HeaderComponent
    | BodyComponent
    | AuthBodyComponent
    | FooterComponent
    | AuthFooterComponent
    | ButtonsComponent;

export interface HeaderComponent {
    type: 'HEADER';
    format: 'TEXT' | 'IMAGE' | 'LOCATION' | 'DOCUMENT';
    text?: string;
    example?: { header_handle: string[] } | { header_url: string[] };
}

export interface BodyComponent {
    type: 'body';
    text: string;
    example?: BodyExample;
}

export interface BodyExample {
    body_text_named_params?: NamedParam[]; // for Named Param
    body_text?: string[][]; // For positional params
}

export interface NamedParam {
    param_name: string;
    example: string;
}

export interface AuthBodyComponent {
    type: 'body';
    add_security_recommendation: boolean;
}

export interface FooterComponent {
    type: 'FOOTER';
    text: string;
}

export interface AuthFooterComponent {
    type: 'FOOTER';
    code_expiration_minutes: number;
}

export interface ButtonsComponent {
    type: 'BUTTONS';
    buttons: Button[];
}

export type Button = QuickReplyButton | UrlButton | PhoneNumberButton | MpmButton | OtpButton;

export interface QuickReplyButton {
    type: 'QUICK_REPLY';
    text: string;
}

export interface UrlButton {
    type: 'URL';
    text: string;
    url: string;
}

export interface PhoneNumberButton {
    type: 'PHONE_NUMBER';
    text: string;
    phone_number: string;
}

export interface MpmButton {
    type: 'MPM'; // Multi-product message
    text: string;
}

export interface OtpButton {
    type: 'OTP';
    otp_type: 'COPY_CODE' | 'ONE_TAP';
    text?: string;
    autofill_text?: string;
    package_name?: string;
    signature_hash?: string;
}

export interface TemplatePaginatedResponse {
    data: Template[];
    pagination: PaginationMeta;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
}
