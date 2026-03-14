import TemplatesPage from '@/features/templates/components/TemplatesPage';
import { apiFetch } from '@/lib/apiFetch';
import { PaginatedResponse } from '@/models/pagination';
import { Template, TemplatePaginatedResponse } from '@/models/templates';

async function getTemplates(page: number = 1): Promise<PaginatedResponse<Template> | undefined> {
    const result = await apiFetch<TemplatePaginatedResponse>(`/templates?page=${page}`);
    if (!result) return undefined;

    return {
        data: result.data,
        total: result.pagination.total,
        per_page: result.pagination.limit,
        current_page: result.pagination.page,
        last_page: result.pagination.total_pages,
    };
}

export default async function Page() {
    const initialData = await getTemplates(1);

    return <TemplatesPage initialData={initialData} />;
}
