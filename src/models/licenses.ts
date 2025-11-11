export interface License {
    id?: number;
    country_id?: number;
    name?: string;
    domain?: string;
    No?: string;
    approval_code?: string;
    tax?: string;
    date?: Date;
    post_code?: string;
    created_by_user_id?: number;
    created_at?: Date;
    pdf_files?: PDFFile[];
}

export interface PDFFile {
    id?: number;
    license_id?: number;
    file_path?: string;
    description?: string;
    created_by_user_id?: number;
    created_at?: Date;
}