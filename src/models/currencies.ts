export interface CurrencyTranslation {
    currency_code?: string
    id: number,
    currency_id: number,
    language_code: string,
    name: string,
    is_locked_by_admin_for_delete: 0 | 1,
    is_locked_by_admin_for_update: 0 | 1,
    one_percent_piece_name?: string,
    one_percent_piece_code?: string,
    code?: string
}

export interface Currency {
    id: number,
    is_main: 0 | 1,
    is_used_in_system: 0 | 1,
    equivalent_to_main_currency: 0 | 1,
    symbol: string,
    currency_type_id?: number,
    currency_code?: string,
    is_locked_by_admin_for_delete: 0 | 1,
    is_locked_by_admin_for_update: 0 | 1,
    fill_photo_path?: string,
    flat_photo_path?: string,
    outline_photo_path?: string,
    icon?: string,
    name?: string,
    translations: Array<CurrencyTranslation>
}