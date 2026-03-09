import RolesPageComponent from '@/features/roles/components/RolesPage';
import { apiFetch } from '@/lib/apiFetch';
import type { PaginatedResponse } from '@/models/pagination';
import type { Role } from '@/models/roles';

// export const runtime = 'edge';

export default async function RolesPage() {
    let initialData: PaginatedResponse<Role> | undefined;
    try {
        initialData = await apiFetch<PaginatedResponse<Role>>('/roles?page=1');
    } catch {
        // Will be handled by error.tsx boundary
    }
    return <RolesPageComponent initialData={initialData} />;
}
