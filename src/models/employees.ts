import { Role } from '@/types/roles';

export interface Employee {
  user_id?: number;
  id?: number;
  working_hours?: number;
  start_work_date?: string;
  end_work_date?: string;
  salary?: string;
  employee_status_id?: string;
  standard_cost_by_hour?: string;
  current_timezone?: string;
  created_by_user_id?: number;
  created_at?: Date;
  job_id?: string;
  nationality_id?: string;
  job_title_id?: number;
  department_id?: number;
  work_contract?: string;
  work_contract_expire?: string;
  citizen?: string;
  office_work?: string;
  given_laptop_etc?: string;
  access?: string;
  reference?: string;
  work_type_id?: number;
  extra_time_price?: string;
  extra_time_price_weekend?: string;
  part_salary_government_and_company?: string;
  date_of_application?: string;
  contract_date?: string;
  contract_duration?: string;
  approval_code?: string;
  break_time_hours?: number;
  start_working_at?: string;
  end_working_at?: string;
  start_break_at?: string;
  end_break_at?: string;
  hour_price?: string;
  ssk_office?: string;
  ssk_number?: string;
  contract_image?: string;
  approval_date?: string;
  official_salary?: string;
  license_id?: number;
  work_office_region_id?: number;
  salary_currency_id?: number;
  official_salary_currency_id?: number;
  is_locked_by_admin_for_delete?: number;
  is_locked_by_admin_for_update?: number;
  username?: string;
  email?: string;
  password?: string;
  avatar?: string;
  mobile_phone?: string;
  email_verified_at?: string;
  work_phone?: string;
  surname?: string;
  birthdate?: string;
  gender?: string;
  address?: string;
  verified?: number;
  remember_token?: string;
  last_active_at?: string;
  is_blocked_by_admin?: number;
  reset_password_token?: string;
  verification_token?: string;
  website_url?: string;
  facebook_account?: string;
  instagram_account?: string;
  telegram_account?: string;
  tiktok_account?: string;
  postal_code?: string;
  can_change_password?: number;
  user_status_id?: number;
  num_of_failed_attempts?: number;
  default_language_id?: string;
  pin?: string;
  role_id?: number;
  followers_number?: number;
  following_number?: number;
  products_number?: number;
  services_number?: number;
  money_transaction_pin?: string;
  signup_country_id?: string;
  last_login_date?: string;
  preferred_currency_id?: string;
  mobile_verification_token?: string;
  mobile_verified_at?: string;
  business_document?: string;
  first_name?: string;
  last_name?: string;
  store_name?: string;
  secondary_email?: string;
  whatsapp_number?: string;
  twitter_url?: string;
  vat_number?: string;
  company_contact_phone_number?: string;
  full_address?: string;
  is_active?: number;
  region_id?: string;
  manager_id?: string;
  is_admin?: number;
  passport_number?: string;
  bank_account_details?: string;
  full_name?: string;
  citizen_country_id?: number;
  birth_city_id?: string;
  id_no?: string;
  passport_photo_path?: string;
  id_photo_path?: string;
  driving_license_no?: string;
  driving_license_photo_path?: string;
  id_no_region?: string;
  driver_license_region?: string;
  city?: string;
  birth_country?: string;
  driving_license_issued_from?: string;
  residence?: string;
  id_issued_from?: string;
  password_expired_at?: Date;
  contact_infos?: ContactInfo[];
  uploaded_files?: UploadedFile[];
  vacation_days?: VacationDay[];
  employee_daily_log?: EmployeeDailyLog;
  work_office_region?: string;
  passport_region_id?: number;
  passport_region_issued_from?: string;
  id_no_region_id?: number;
  driving_license_region_id?: number;
  city_id?: number;
  roles?: Array<Role>;
}

export interface EmployeeDailyLog {
  id?: number;
  employee_id?: number;
  start_working_at?: Date;
  end_working_at?: string;
  start_break_at?: string;
  end_break_at?: string;
  overtime_end_at?: string;
  overtime_start_at?: string;
  break_time_difference?: string;
  executed_working_hours?: string;
  working_time_difference?: string;
  overtime_hours?: string;
  total_day_pay?: string;
  is_weekend?: number;
  ip?: string;
  start_working_delay?: string;
  end_working_delay?: string;
  start_break_delay?: string;
  end_break_delay?: string;
  executed_working_time?: string;
  is_locked_by_admin_for_delete?: number;
  is_locked_by_admin_for_update?: number;
}

export interface VacationDay {
  id?: number;
  name?: string;
  is_weekend?: number;
  is_locked_by_admin_for_delete?: number;
  is_locked_by_admin_for_update?: number;
  pivot?: Pivot;
}

export interface Pivot {
  employee_id?: number;
  weekday_id?: number;
}

export interface ContactInfo {
  id?: number;
  type?: string;
  value?: string;
}

export interface UploadedFile {
  id?: number;
  name?: string;
  path?: string;
}
