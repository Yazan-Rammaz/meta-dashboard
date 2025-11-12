import { useGetpermissionsQuery } from '@/services/permissions';
import { ReactElement } from 'react';

export interface CanCallProps {
  children?: ReactElement | string;
  permission?: string;
}
export default function CanCall({ children, permission }: CanCallProps) {
  const { data: permissions, isLoading } = useGetpermissionsQuery();

  const permissionGranted = isLoading
    ? false
    : permissions?.some(
        (one) => one.key === permission || one.key === 'SUPER_ADMIN'
      );

  if (!permissionGranted) return <></>;
  else return <>{children}</>;
}
