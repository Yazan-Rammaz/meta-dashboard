import MetaLoginFrameContent from '@/features/clients/components/MetaLoginFrameContent';

interface MetaLoginFramePageProps {
    searchParams?: Promise<{
        loginType?: string;
    }>;
}

export default async function MetaLoginFramePage({ searchParams }: MetaLoginFramePageProps) {
    const resolvedSearchParams = await searchParams;
    const loginType = resolvedSearchParams?.loginType === 'meta' ? 'meta' : 'whatsapp';

    return <MetaLoginFrameContent loginType={loginType} />;
}
