export interface Translation {
    id: number,
    name: string,
    description?: string,
    flat_photo_path?: string,
    outline_photo_path?: string,
    fill_photo_path?: string,
    language_code: string,
    created_at: string,
    created_by_user_id?: number,
    is_locked_by_admin_for_delete: 0 | 1,
    is_locked_by_admin_for_update: 0 | 1
}

export interface Language {
    name: string,
    name_in_native_language?: string,
    language_code: string,
    is_default?: 0 | 1,
    updated_at?: string,
    is_used_in_system?: 0 | 1,
    file_path?: string,
    is_locked_by_admin_for_delete?: 0 | 1,
    is_locked_by_admin_for_update?: 0 | 1,
    id: number,
    parent_language_code?: null | string,
    flat_photo_path?: null | string,
    outline_photo_path?: null | string,
    fill_photo_path?: null | string,
    icon?: null | string,
    translations: Array<Translation>,
    son_languages?: Array<Language>
}