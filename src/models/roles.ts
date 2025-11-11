export interface Role {
  id?: number;
  title?: string;
  programming_name?: string | null;
  programing_name?: string | null;
  role_translations?: RoleTranslation[];
  permissions?: Permission[];
}

export interface Permission {
  description?: string;
  id?: string;
  title?: string;
  created_at?: Date | null;
  updated_at?: Date | null;
  deleted_at?: Date | null;
  pivot?: Pivot;
}

export interface RoleTranslation {
  role_id?: number;
  id?: number;
  name?: string;
  language_code?: string;
}

export interface Pivot {
  role_id?: number;
  permission_id?: number;
}
