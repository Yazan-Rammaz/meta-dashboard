import { useGetpermissionsQuery } from '@/services/permissions';
import { useAuthStore } from '@/stores/authStore';
import { PermissionKey } from '@/types/permissions';
import { ReactElement } from 'react';

export interface CanCallProps {
    children?: ReactElement | string;
    permission?: string;
}
export default function CanCall({ children, permission }: CanCallProps) {
    const access_token = useAuthStore((s) => s.access_token);
    const { data: permissions, isLoading } = useGetpermissionsQuery({
        enabled: !!access_token, // Only fetch if user is logged in
    });

    const permissionGranted = isLoading
        ? false
        : permission === '' ||
          permissions?.some(
              (one) => one.key === permission || one.key === PermissionKey.SUPER_ADMIN,
          );

    if (!permissionGranted) return <></>;
    else return <>{children}</>;
}
