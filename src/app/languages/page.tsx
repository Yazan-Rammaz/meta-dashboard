import Languages from '@/features/languages/components/LanguagesPage';
import { apiFetch } from '@/lib/apiFetch';
import type { Language } from '@/models/languages';

export default async function LanguagesPage() {
    let initialData: Language[] | undefined;
    try {
        initialData = await apiFetch<Language[]>('/languages/all_languages');
    } catch {
        // Will be handled by error.tsx boundary
    }
    return <Languages initialData={initialData} />;
}
