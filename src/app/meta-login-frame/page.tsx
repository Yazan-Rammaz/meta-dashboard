import MetaLoginFrameContent from '@/features/clients/components/MetaLoginFrameContent';

interface MetaLoginFramePageProps {
    searchParams?: {
        loginType?: string;
    };
}

export default function MetaLoginFramePage({ searchParams }: MetaLoginFramePageProps) {
    const loginType = searchParams?.loginType === 'meta' ? 'meta' : 'whatsapp';

    return <MetaLoginFrameContent loginType={loginType} />;
}
