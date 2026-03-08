import Scrollbar from '@/components/Scrollbar';
import Arrange from '@/ui/icons/arrange.js';
import CloseModalIcon from '@/ui/icons/closeModalIcon.js';
import ModalIcon from '@/ui/icons/modalIcon.js';
import { styled } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { arrayMoveImmutable } from 'array-move';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import SortableList, { SortableItem } from 'react-easy-sort';

interface SortableListProps {
    items: Array<{
        id?: number;
        name: string;
        image: string;
    }>;
    setItems: (items: Array<{ id?: number; name: string; image: string }>) => void;
    title: string;
    close: () => void;
    relativePath: string;
}
const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
        height: '600px',
        width: '400px',
    },
    item: {
        width: '385px',
        height: '128px',
        position: 'relative',
        flexShrink: 0,
        display: 'flex',
        margin: 8,
        cursor: 'grab',
        userSelect: 'none',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    image: {
        width: '360px',
        height: '128px',
        pointerEvents: 'none',
        borderRadius: '15px',
        boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 10px, rgba(255, 255, 255, 0.5) 0px 3px 6px inset',
    },
    button: {
        position: 'absolute',
        bottom: 0,
        right: 0,
    },
    dragged: {
        width: '400px',
        height: '142px',
        zIndex: 99999,
        '& svg': {
            display: 'none',
        },
        '& img': {
            width: '400px',
            height: '142px',
        },
    },
});
const ModalContainer = styled('div')(
    () => `
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: column;
        width: 430px;
        height: 777px;
        position: fixed;
        bottom: 20px;
        right: 450px;
        background-color: #F7F7F7;
        border-radius: 10px;
        box-shadow: 0px 6px 20px #0000001a;
    `,
);
const ModalHeader = styled('div')(
    () => `
        margin: 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row;
        height: 16px;
        width: -webkit-fill-available;

    `,
);
const ModalFooter = styled('div')(
    () => `
        margin: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        flex-direction: row;
        width: 400px;
        height: 40px;
        background-color: #6694FC;
        color: #FAFAFA;
        font-size: 14px;
        border-radius: 10px;
        cursor: pointer;
    `,
);
const Title = styled('div')(
    () => `
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row;
    `,
);
const ModalClose = styled('div')(
    () => `
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row;
    `,
);
export default function SortableListModal({
    items,
    setItems,
    title,
    close,
    relativePath,
}: SortableListProps) {
    const classes = useStyles();
    const [localItems, setLocalItems] = useState(items);
    const onSortEnd = (oldIndex: number, newIndex: number) => {
        setLocalItems(arrayMoveImmutable(localItems, oldIndex, newIndex));
    };
    useEffect(() => {
        setLocalItems(items);
    }, [items]);
    return (
        <ModalContainer>
            <ModalHeader>
                <Title>
                    <ModalIcon /> {title}
                </Title>
                <ModalClose onClick={() => close()}>
                    <CloseModalIcon />
                </ModalClose>
            </ModalHeader>
            <SortableList
                onSortEnd={onSortEnd}
                className={classes.root}
                draggedItemClassName={classes.dragged}
            >
                <Scrollbar>
                    {localItems?.map(({ name, image }) => (
                        <SortableItem key={name}>
                            <div className={classes.item}>
                                <Arrange />
                                <Image
                                    className={classes.image}
                                    alt={name}
                                    src={relativePath + image}
                                    width={360}
                                    height={128}
                                />
                            </div>
                        </SortableItem>
                    ))}
                </Scrollbar>
            </SortableList>
            <ModalFooter
                onClick={() => {
                    setItems(localItems);
                    close();
                }}
            >
                {'Done'}
            </ModalFooter>
        </ModalContainer>
    );
}
