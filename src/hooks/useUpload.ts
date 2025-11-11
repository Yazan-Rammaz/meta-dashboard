import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUploads } from '@/features/upload/uploadSlice';

export const useUploadProgress = () => {
  const uploads = useSelector(selectCurrentUploads);

  return useMemo(() => ({ uploads }), [uploads]);
};
