import { ReactElement } from 'react';
import { useGetpermissionsQuery } from '@/services/permissions';

export interface CanCallProps {
  children?: ReactElement | string;
  permission?: string;
}
export default function CanCall({ children, permission }: CanCallProps) {
  const { data: permissions, isLoading } = useGetpermissionsQuery();

  const permissionGranted = isLoading
    ? false
    : permissions?.some(
        (one) => one.name === permission || one.name === 'SUPER_ADMIN'
      );

  if (!permissionGranted) return <></>;
  else return <>{children}</>;
}
