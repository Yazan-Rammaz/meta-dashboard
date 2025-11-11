import { ReactElement, useEffect } from 'react';
import { styled } from '@mui/material';
import LoadingImage from '@/features/shared/components/LoadingImage';
import Image from 'next/image';

const ImageUploadContainer = styled('div')(
  () => `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        background-image: url("data:image/svg+xml,%3csvg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%' height='100%' fill='none' rx='10' ry='10' stroke='%23DDDDDD' stroke-width='1' stroke-dasharray='2%2c3' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
        border-radius: 10px;
        color: #8E8E8E;
        font-size: 10px;
        contain: content;
        `
);
export interface ImageUploadProps {
  width: number;
  height: number;
  icon: ReactElement | string;
  text?: string;
  onDropImage: (event: React.DragEvent, type: string) => void;
  onDragOver: (event: React.DragEvent) => void;
  onClick: () => void;
  remove: () => void;
  mode: 'add' | 'update' | 'preview';
  loading: boolean;
  image_path?: string;
  invalidate?: number;
}

export default function ImageUpload({
  loading,
  onClick,
  remove,
  mode,
  width,
  height,
  icon,
  text,
  onDropImage,
  onDragOver,
  image_path,
  invalidate
}: ImageUploadProps) {
  const random = Math.random() + Math.random();

  useEffect(() => {
    if (invalidate && invalidate > 0) {
      const element = document.getElementById(random.toString());
      if (element) {
        element.classList.add('shake-modal');
        element.classList.add('red-bord');
        setTimeout(() => {
          element.classList.remove('shake-modal');
        }, 600);
        setTimeout(() => {
          element.classList.remove('red-bord');
        }, 1000);
      }
    }
  }, [invalidate, random]); // Added random to dependency array

  return (
    <>
      {image_path ? (
        <ImageUploadContainer
          id={random.toString()}
          style={{
            width: `${width}px`,
            height: `${height}px`
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            if (mode !== 'preview') remove();
          }}
        >
          <Image
            alt="Uploaded Image"
            src={image_path}
            width={width}
            height={height}
          />
        </ImageUploadContainer>
      ) : (
        <ImageUploadContainer
          id={random.toString()}
          style={{
            width: `${width}px`,
            height: `${height}px`
          }}
          onDragLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          onDragEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
          onDrop={(e) => {
            onDropImage(e, 'flat_photo_path');
          }}
          onDragOver={(e) => onDragOver(e)}
          onClick={() => onClick()}
        >
          {loading ? (
            <div className="modal-icon">
              <LoadingImage />
            </div>
          ) : (
            <>
              {typeof icon === 'string' ? (
                <Image alt="Upload Icon" src={icon} width={10} height={10} />
              ) : (
                icon
              )}
              {text}
            </>
          )}
        </ImageUploadContainer>
      )}{' '}
    </>
  );
}
