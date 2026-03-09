import Clients from '@/features/clients/components/ClientsPage';
import { apiFetch } from '@/lib/apiFetch';
import type { Client } from '@/models/clients';
import type { PaginatedResponse } from '@/models/pagination';

export const runtime = 'edge';

export default async function ClientsPage() {
    let initialData: PaginatedResponse<Client> | undefined;
    try {
        initialData = await apiFetch<PaginatedResponse<Client>>('/clients?page=1');
    } catch {
        // Will be handled by error.tsx boundary
    }
    return <Clients initialData={initialData} />;
}
