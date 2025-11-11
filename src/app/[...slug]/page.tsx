'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CatchAllPage({
  params
}: {
  params: { slug: string[] };
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [isClientLoaded, setIsClientLoaded] = useState(false);

  useEffect(() => {
    setIsClientLoaded(true);
  }, []);

  useEffect(() => {
    // Only redirect if client is loaded and user is not authenticated
    if (isClientLoaded && !user) {
      router.push('/login');
    }
  }, [isClientLoaded, user, router]);

  if (!isClientLoaded || !user) {
    return null; // Render nothing while client is loading or user is not authenticated
  }

  const path = params.slug ? `/${params.slug.join('/')}` : '/';

  // Render different components based on the path
  switch (path) {
    default:
      // You can add a 404 page here or a default dashboard component
      return <div>Page Not Found or Under Construction</div>;
  }
}
