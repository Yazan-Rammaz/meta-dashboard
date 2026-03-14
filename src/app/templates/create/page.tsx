import CreateTemplatePage from '@/features/templates/components/CreateTemplatePage';
import { Container } from '@mui/material';
import Link from 'next/link';

export default function Page() {
    return (
        <>
            <Container maxWidth="xl" sx={{ pt: 2 }}>
                <Link className="hover:text-blue-500 hover:underline" href="/templates">
                    Return to Templates
                </Link>
            </Container>
            <CreateTemplatePage />
        </>
    );
}
