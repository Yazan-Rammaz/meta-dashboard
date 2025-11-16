export interface Role {
  id?: number;
  name?: string;
  title?: string;
  programming_name?: string | null;
  programing_name?: string | null;
  permissions?: string[];
  description?: string | null;
}

export interface Permission {
  id?: string;
  key?: string;
  description?: string;
  created_at?: Date | null;
  // title?: string;
  // updated_at?: Date | null;
  // deleted_at?: Date | null;
  // pivot?: Pivot;
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
