export interface Department {
    id?: number;
    flat_photo_path?: string;
    fill_photo_path?: string;
    outline_photo_path?: string;
    png_photo_path?: string;
    created_by_user_id?: number;
    updated_by_user_id?: number;
    deleted_by_user_id?: number;
    parent_department_id?: number;
    role_id?: number;
    is_locked_by_admin_for_delete?: 0 | 1;
    is_locked_by_admin_for_update?: 0 | 1;
    num_of_employees?: number;
    translations: Translation[];
    son_departments?: Department[];
    short_name?: string
}

export interface Translation {
    id: number;
    language_code: string;
    name?: string;
    short_name?: null | string;
    description?: string;
    department_id: number;
    created_by_user_id?: number;
    updated_by_user_id?: number;
    deleted_by_user_id?: number;
    is_locked_by_admin_for_delete?: 0 | 1;
    is_locked_by_admin_for_update?: 0 | 1;
}