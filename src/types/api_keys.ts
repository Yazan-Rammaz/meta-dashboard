export interface ApiKey {
  id?: string;
  client_id?: string;
  key_hash?: string; // Present when fetching existing keys
  api_key?: string; // The actual API key, returned on creation
  hmac_secret?: string;
  label?: string;
  rate_limit_per_minute?: number;
  created_at?: string;
  last_used_at?: string;
  revoked?: boolean;
}

export interface ApiKeyCreationRequest {
  client_id: string;
  label: string;
  rate_limit_per_minute: number;
}
