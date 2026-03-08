import Users from '@/features/users/components/UsersPage';
import { apiFetch } from '@/lib/apiFetch';
import type { PaginatedResponse } from '@/models/pagination';
import type { User } from '@/models/users';

export default async function UsersPage() {
    let initialData: PaginatedResponse<User> | undefined;
    try {
        initialData = await apiFetch<PaginatedResponse<User>>('/users?page=1');
    } catch {
        // Will be handled by error.tsx boundary
    }
    return <Users initialData={initialData} />;
}
