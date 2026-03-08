'use client';

import ListComponent from '@/components/List';
import ListItemComponent from '@/components/List/ListItem';
import SuspenseLoader from '@/components/SuspenseLoader';
import { useToast } from '@/contexts/toastContext';
import { deleteLanguageAction } from '@/features/languages/actions';
import LanguageModal from '@/features/languages/components/LanguageModal';
import { TopNav } from '@/features/shared/components/DashboardShared';
import { queryClient } from '@/lib/queryClient';
import { Language } from '@/models/languages';
import { useGetlanguagesQuery } from '@/services/languages';
import EmptyIcon from '@/ui/icons/emptyIcon.svg';
import LanguagesIcon from '@/ui/icons/languages.svg';
import ModalComponent from '@/ui/Modal';
import ModalHeader from '@/ui/Modal/ModalHeader';
import ShowTrans, { transformTranslations } from '@/utils/showTrans';
import useTrans from '@/utils/translation_util';
import Image from 'next/image';
import { useState, useTransition } from 'react';
import { Helmet } from 'react-helmet-async';

interface Props {
    initialData?: Language[];
}

interface MapProps {
    elements?: Array<Language>;
    setOpen: (open: boolean) => void;
    setElement: (element: Language) => void;
    setMode: (mode: 'add' | 'update' | 'preview') => void;
    updating?: number;
    addChild?: (element: Language) => void;
    deleteItem?: (element: Language) => void;
    add_in?: string | null;
    currentData?: Language;
    mode: 'add' | 'update' | 'preview';
    isUpdateLoading?: boolean;
    isUpdateSuccess?: boolean;
    isUpdateError?: boolean;
    isDeleteLoading?: boolean;
    isDeleteSuccess?: boolean;
    isDeleteError?: boolean;
    isAddLoading?: boolean;
    isAddSuccess?: boolean;
    isAddError?: boolean;
}

const MapElements = ({
    elements,
    setOpen,
    setElement,
    setMode,
    updating,
    addChild,
    deleteItem,
    add_in,
    currentData,
    mode,
    isDeleteError,
    isDeleteLoading,
    isDeleteSuccess,
    isUpdateError,
    isUpdateLoading,
    isUpdateSuccess,
    isAddError,
    isAddLoading,
    isAddSuccess,
}: MapProps) => {
    if (elements) {
        return (
            <ListComponent>
                <>
                    {elements?.map((element, index) => (
                        <ListItemComponent
                            isLoading={
                                (currentData?.id === element.id && isUpdateLoading) ||
                                (currentData?.id === element.id && isDeleteLoading)
                            }
                            isSuccess={
                                (currentData?.id === element.id && isUpdateSuccess) ||
                                (currentData?.id === element.id && isDeleteSuccess)
                            }
                            isError={
                                (currentData?.id === element.id && isUpdateError) ||
                                (currentData?.id === element.id && isDeleteError)
                            }
                            add_permission="CREATE_LANGUAGES"
                            delete_permission="DELETE_LANGUAGES"
                            key={index}
                            nested={
                                element.language_code === add_in && mode === 'add' ? (
                                    <>
                                        <ListItemComponent
                                            isLoading={isAddLoading}
                                            isError={isAddError}
                                            isSuccess={isAddSuccess}
                                            hasDelete={false}
                                            hasAddChild={false}
                                        >
                                            <>
                                                <Image
                                                    src={
                                                        currentData?.flat_photo_path ||
                                                        EmptyIcon.src
                                                    }
                                                    alt="Language Flag Icon"
                                                    width={15}
                                                    height={15}
                                                    style={{
                                                        marginRight: '10px',
                                                    }}
                                                />{' '}
                                                {ShowTrans({
                                                    Translations: transformTranslations(
                                                        currentData?.translations || [],
                                                    ),
                                                    field_name: 'name',
                                                })}
                                            </>
                                        </ListItemComponent>
                                        {addChild &&
                                            deleteItem &&
                                            MapElements({
                                                elements: element.son_languages ?? [],
                                                setOpen,
                                                setElement,
                                                setMode,
                                                updating,
                                                addChild,
                                                deleteItem,
                                                add_in,
                                                currentData,
                                                mode,
                                            })}
                                    </>
                                ) : (
                                    <>
                                        {addChild &&
                                            deleteItem &&
                                            MapElements({
                                                elements: element.son_languages ?? [],
                                                setOpen,
                                                setElement,
                                                setMode,
                                                updating,
                                                addChild,
                                                deleteItem,
                                                add_in,
                                                currentData,
                                                mode,
                                            })}
                                    </>
                                )
                            }
                            openItem={() => {
                                setMode('preview');
                                setElement(element);
                                setOpen(true);
                            }}
                            hasNested={
                                (element.son_languages?.length ?? 0) > 0 ||
                                (add_in != null &&
                                    element.language_code === (add_in as string) &&
                                    mode === 'add')
                            }
                            nestedCount={
                                add_in != null &&
                                element.language_code === (add_in as string) &&
                                mode === 'add'
                                    ? (element.son_languages?.length ?? 0) + 1
                                    : (element.son_languages?.length ?? 0)
                            }
                            addChild={() => addChild && addChild(element)}
                            hasAddChild={true}
                            hasDelete={true}
                            handleDelete={() => deleteItem && deleteItem(element)}
                            forceOpen={
                                add_in != null &&
                                element.language_code === (add_in as string) &&
                                mode === 'add'
                            }
                        >
                            <>
                                <Image
                                    src={element.flat_photo_path || EmptyIcon.src}
                                    alt="Language Flag Icon"
                                    width={15}
                                    height={15}
                                    style={{
                                        marginRight: '10px',
                                    }}
                                />{' '}
                                {ShowTrans({
                                    Translations: transformTranslations(element.translations),
                                    field_name: 'name',
                                })}
                            </>
                        </ListItemComponent>
                    ))}
                </>
            </ListComponent>
        );
    } else {
        return <></>;
    }
};
const initialState: Language = {
    name: '',
    name_in_native_language: '',
    language_code: '',
    is_default: 0,
    updated_at: '',
    is_used_in_system: 1,
    file_path: '',
    is_locked_by_admin_for_delete: 0,
    is_locked_by_admin_for_update: 0,
    id: 0,
    parent_language_code: null,
    flat_photo_path: null,
    outline_photo_path: null,
    fill_photo_path: null,
    icon: null,
    translations: [],
    son_languages: [],
};
export default function Languages({ initialData }: Props) {
    const trans = useTrans();
    const { showError } = useToast();
    const [isPending, startTransition] = useTransition();

    const { data: Languages, isLoading: isLoadingLanguages } = useGetlanguagesQuery({
        initialData,
    });
    const [open, setOpen] = useState<boolean>(false);
    const [mode, setMode] = useState<'add' | 'update' | 'preview' | null>(null);
    const [currentData, setCurrentData] = useState<Language>(initialState);

    const handleDeleteLanguage = (item: Language) => {
        startTransition(async () => {
            const result = await deleteLanguageAction(item.language_code);
            if (result.success) {
                result.invalidateKeys?.forEach((k) =>
                    queryClient.invalidateQueries({ queryKey: [k] }),
                );
            } else {
                showError(result.error ?? trans('Failed to delete language'));
            }
        });
        setOpen(false);
        setCurrentData(initialState);
    };

    return (
        <>
            <Helmet>
                <title>{trans('Languages')}</title>
            </Helmet>
            <TopNav
                add_permission="CREATE_LANGUAGES"
                table_icon={LanguagesIcon}
                table_name={trans('Languages')}
                top_name_clk={() => {}}
                open_button_clk={() => {
                    setOpen(true);
                    setCurrentData(initialState);
                    setMode('add');
                }}
            />
            <div style={{ padding: '70px 20px 20px 20px' }}>
                {isLoadingLanguages ? (
                    <SuspenseLoader />
                ) : (
                    <>
                        {mode === 'add' && open && !currentData.parent_language_code ? (
                            <ListItemComponent
                                isLoading={isPending}
                                isSuccess={false}
                                isError={false}
                                hasDelete={false}
                                hasAddChild={false}
                            >
                                <>
                                    <Image
                                        src={currentData.flat_photo_path || EmptyIcon.src}
                                        alt="Language Flag Icon"
                                        width={15}
                                        height={15}
                                        style={{
                                            marginRight: '10px',
                                        }}
                                    />{' '}
                                    {ShowTrans({
                                        Translations: transformTranslations(
                                            currentData.translations,
                                        ),
                                        field_name: 'name',
                                    })}
                                </>
                            </ListItemComponent>
                        ) : (
                            <></>
                        )}
                        {MapElements({
                            isUpdateLoading: isPending,
                            isUpdateSuccess: false,
                            isUpdateError: false,
                            isDeleteLoading: isPending,
                            isDeleteSuccess: false,
                            isDeleteError: false,
                            isAddLoading: isPending,
                            isAddSuccess: false,
                            isAddError: false,
                            mode: mode as 'add' | 'update' | 'preview',
                            add_in: currentData.parent_language_code,
                            currentData,
                            elements: Languages ?? [],
                            setOpen,
                            setElement: setCurrentData,
                            setMode,
                            updating: isPending && currentData.id ? currentData.id : undefined,
                            addChild: (element: Language) => {
                                setMode('add');
                                setOpen(true);
                                setCurrentData({
                                    ...initialState,
                                    parent_language_code: element.language_code,
                                });
                            },
                            deleteItem: (item: Language) => {
                                handleDeleteLanguage(item);
                            },
                        })}{' '}
                    </>
                )}
                {
                    <ModalComponent open={open}>
                        <>
                            <ModalHeader
                                add_permission="CREATE_LANGUAGES"
                                delete_permission="DELETE_LANGUAGES"
                                update_permission="UPDATE_LANGUAGES"
                                Delete={() => {
                                    handleDeleteLanguage(currentData);
                                }}
                                close={() => {
                                    setOpen(false);
                                    setCurrentData(initialState);
                                }}
                                title={
                                    currentData
                                        ? (String(
                                              ShowTrans({
                                                  Translations: transformTranslations(
                                                      currentData.translations,
                                                  ),
                                                  field_name: 'name',
                                              }),
                                          ) ?? currentData.name)
                                        : trans('Language')
                                }
                                mode={mode as 'add' | 'update' | 'preview'}
                                icon={<></>}
                                edit={() => {
                                    setOpen(true);
                                    setMode('update');
                                }}
                                hasAddSub={true}
                                addChild={() => {
                                    setMode('add');
                                    setCurrentData({
                                        ...initialState,
                                        parent_language_code: currentData.language_code,
                                    });
                                }}
                                clear_button_clk={() => {
                                    if (mode === 'update') {
                                        const foundLanguage = Languages?.filter(
                                            (one) => one.id === currentData.id,
                                        )[0];
                                        setCurrentData(foundLanguage || initialState);
                                    } else {
                                        setCurrentData(initialState);
                                    }
                                }}
                            />
                            <LanguageModal
                                currentData={currentData}
                                setCurrentData={setCurrentData}
                                mode={mode as 'add' | 'update' | 'preview'}
                                onClose={() => {
                                    setOpen(false);
                                    setCurrentData(initialState);
                                    if (mode === 'update') setMode('preview');
                                }}
                            />
                        </>
                    </ModalComponent>
                }
            </div>
        </>
    );
}
