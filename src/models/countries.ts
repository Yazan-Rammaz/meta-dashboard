import { Language } from '@/models/languages';

export interface RegionTranslation {
  id: number;
  region_name: string;
  language_code: string;
}
export interface RegionCurrency {
  id?: number;
  country_id?: number;
  currency_id: number;
  is_default: 0 | 1;
  created_by_user_id?: string;
  updated_by_user_id?: string;
  deleted_by_user_id?: string;
  created_at?: string;
}
export interface Country {
  id: number;
  region_translations: Array<RegionTranslation>;
  sub_regions: Array<Country>;
  pallets_count?: number;
  icon: string;
  region_code?: string;
  languages?: Array<Language>;
  currencies?: Array<RegionCurrency>;
  phone_code?: string;
  post_code?: string;
  gmt_difference?: number;
  is_country: 0 | 1;
  is_city: 0 | 1;
  country_id?: number;
  region_type_id?: 1 | 2;
  country?: Country;
  city?: Country;
  parent_region_id?: number;
  flat_photo_path?: string;
  outline_photo_path?: string;
  flag_photo_path?: string;
  map_photo_path?: string;
}
