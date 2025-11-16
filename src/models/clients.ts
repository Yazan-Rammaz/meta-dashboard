export interface Client {
  id?: string;
  user_id?: string;
  name: string;
  display_phone_number?: string;
  phone_number_id: string;
  whatsapp_business_id: string;
  webhook_url?: string | null;
  rate_limit_per_minute: number;
  status?: string;
  access_token: string;
  created_at?: string;
  updated_at?: string;
}
