import X from '@/ui/icons/xicon.svg';
import { useThumbnails } from '@mkholt/pdf-thumbnail';
import Image from 'next/image';
import { useEffect, useState } from 'react';
interface PDFElemProps {
    path: string;
    clear: () => void;
}

function PDFElem(props: PDFElemProps) {
    const [imgs, setimgs] = useState<string>('');
    const { thumbnails } = useThumbnails([{ file: props.path }]);

    useEffect(() => {
        if (thumbnails && thumbnails.length > 0) {
            setimgs(thumbnails[0].thumbData);
        }
    }, [thumbnails]);

    return (
        <div className="pdf-loading">
            <span onClick={() => props.clear()} className="abs-delt">
                <Image src={X.src} alt="X" width={20} height={20} />
            </span>
            {imgs && (
                <a rel="noreferrer" target={'_blank'} href={props.path}>
                    <Image alt="PDF Thumbnail" src={imgs} width={50} height={70} />
                </a>
            )}
            <svg
                id="bord"
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="70"
                viewBox="0 0 50 70"
            >
                <g
                    id="Rectangle_4658"
                    data-name="Rectangle 4658"
                    fill="none"
                    stroke="#707070"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="0.5"
                    strokeDasharray="2 3"
                >
                    <rect x="0.25" y="0.25" width="49.5" height="69.5" rx="9.75" fill="none" />
                </g>
            </svg>
        </div>
    );
}

export default PDFElem;
