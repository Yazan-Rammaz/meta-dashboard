'use client';

import ImageUpload from '@/components/ImageUpload';
import { useToast } from '@/contexts/toastContext';
import { createLanguageAction, updateLanguageAction } from '@/features/languages/actions';
import { queryClient } from '@/lib/queryClient';
import { Language, Translation } from '@/models/languages';
import { useGetlanguagesQuery } from '@/services/languages';
import { useUploadMutation } from '@/services/upload';
import ModalActionButton from '@/ui/Button/modalActionButton';
import PlusUpload from '@/ui/icons/plusImage.svg';
import Input from '@/ui/Input';
import ModalBody from '@/ui/Modal/ModalBody';
import ModalSection from '@/ui/ModalSection';
import ModalSectionVertical from '@/ui/ModalSection/vertical';
import SwitchInput from '@/ui/Switch';
import useTrans from '@/utils/translation_util';
import { useEffect, useState, useTransition } from 'react';

interface Props {
    currentData: Language;
    setCurrentData: Function;
    onClose: () => void;
    mode: 'add' | 'update' | 'preview';
}

type ImagePathType = 'flat_photo_path' | 'outline_photo_path' | 'fill_photo_path';

export default function LanguageModal({ currentData, setCurrentData, mode, onClose }: Props) {
    const trans = useTrans();
    const { showSuccess, showError } = useToast();
    const [isPending, startTransition] = useTransition();

    const initialTranslationState: Translation = {
        id: 0, // Assuming a default ID for new translations
        name: '',
        language_code: '', // Will be overridden by language.language_code
        created_at: new Date().toISOString(), // Default current date
        is_locked_by_admin_for_delete: 0,
        is_locked_by_admin_for_update: 0,
    };

    const { data: languages, isLoading: isLoadingLanguages } = useGetlanguagesQuery({
        staleTime: Infinity,
    });
    const [type, setType] = useState<ImagePathType | ''>('');
    const {
        mutateAsync: upload,
        isPending: uploading,
        isError: isErrorUploading,
        data: currentFilePath,
    } = useUploadMutation();

    useEffect(() => {
        if (currentFilePath) {
            setCurrentData({
                ...currentData,
                [type]: currentFilePath,
            });
            setType('');
        }
    }, [currentFilePath]);

    const updateImage = async (file: File, imageType: ImagePathType) => {
        setType(imageType);
        const file_name = file.name.split('.')[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('file_name', file_name);
        await upload({ payload: formData });
        if (isErrorUploading) {
            showError(trans('error uploading file'));
            setType('');
        }
    };
    const onDropImage = (e: React.DragEvent<Element>, imageType: ImagePathType) => {
        if (mode !== 'preview') {
            e.preventDefault();
            if (
                e.dataTransfer.files.length === 1 &&
                e.dataTransfer.files[0].type === 'image/svg+xml'
            ) {
                updateImage(e.dataTransfer.files[0], imageType);
            } else {
                showError(trans('invalid svg'));
            }
        }
    };
    const updatPhoto = (name: ImagePathType) => {
        if (mode !== 'preview') {
            const Image = document.createElement('input');
            Image.onchange = () => {
                if (Image.files && Image.files[0]) {
                    updateImage(Image.files[0], name);
                }
            };
            Image.type = 'file';
            Image.hidden = true;
            Image.accept = 'image/svg+xml';
            const i = document.body.appendChild(Image);
            i.click();
        }
    };
    const onDragOver = (e: React.DragEvent<Element>) => {
        if (mode !== 'preview') e.preventDefault();
    };
    const remove = (imageType: ImagePathType) => {
        const tmp: Language = { ...currentData };
        tmp[imageType] = '';
        setCurrentData({ ...tmp });
    };
    return (
        <ModalBody>
            <>
                <ModalSectionVertical title={trans('Language Icon')} required>
                    <>
                        <ModalSection size={13} without_margin>
                            <ImageUpload
                                height={50}
                                width={50}
                                icon={PlusUpload}
                                onDropImage={(e) => onDropImage(e, 'flat_photo_path')}
                                mode={mode}
                                onClick={() => updatPhoto('flat_photo_path')}
                                onDragOver={(e) => onDragOver(e)}
                                remove={() => remove('flat_photo_path')}
                                loading={type === 'flat_photo_path' && uploading}
                                image_path={
                                    currentData.flat_photo_path ? currentData.flat_photo_path : ''
                                }
                                text={trans('Flat')}
                            />
                        </ModalSection>
                        <ModalSection size={13} without_margin>
                            <ImageUpload
                                height={50}
                                width={50}
                                icon={PlusUpload}
                                onDropImage={(e) => onDropImage(e, 'outline_photo_path')}
                                mode={mode}
                                onClick={() => updatPhoto('outline_photo_path')}
                                onDragOver={(e) => onDragOver(e)}
                                remove={() => remove('outline_photo_path')}
                                loading={type === 'outline_photo_path' && uploading}
                                image_path={
                                    currentData.outline_photo_path
                                        ? currentData.outline_photo_path
                                        : ''
                                }
                                text={trans('Outline')}
                            />
                        </ModalSection>
                        <ModalSection size={13} without_margin>
                            <ImageUpload
                                height={50}
                                width={50}
                                icon={PlusUpload}
                                onDropImage={(e) => onDropImage(e, 'fill_photo_path')}
                                mode={mode}
                                onClick={() => updatPhoto('fill_photo_path')}
                                onDragOver={(e) => onDragOver(e)}
                                remove={() => remove('fill_photo_path')}
                                loading={type === 'fill_photo_path' && uploading}
                                image_path={
                                    currentData.fill_photo_path ? currentData.fill_photo_path : ''
                                }
                                text={trans('Fill')}
                            />
                        </ModalSection>
                    </>
                </ModalSectionVertical>
                <ModalSection title={trans('Language Code & Name')}>
                    <>
                        <Input
                            size={2}
                            value={currentData.language_code}
                            disabled={mode === 'preview'}
                            clear={() => {
                                setCurrentData({
                                    ...currentData,
                                    language_code: '',
                                });
                            }}
                            onChange={(value: string | number) => {
                                setCurrentData({
                                    ...currentData,
                                    language_code: String(value),
                                });
                            }}
                            type="text"
                        />
                        {!isLoadingLanguages &&
                            languages?.length &&
                            languages?.map((language, index) => (
                                <Input
                                    size={index === 0 ? 8 : 5}
                                    key={index}
                                    title={language.language_code}
                                    value={
                                        currentData.translations.filter(
                                            (one) => one.language_code === language.language_code,
                                        )[0]?.name || ''
                                    }
                                    disabled={mode === 'preview'}
                                    clear={() => {
                                        if (
                                            currentData.translations.filter(
                                                (one) =>
                                                    one.language_code === language.language_code,
                                            )?.length
                                        ) {
                                            setCurrentData({
                                                ...currentData,
                                                translations: currentData.translations?.map(
                                                    (one) => {
                                                        if (
                                                            one.language_code ===
                                                            language.language_code
                                                        ) {
                                                            return { ...one, name: '' };
                                                        } else {
                                                            return { ...one };
                                                        }
                                                    },
                                                ),
                                            });
                                        } else {
                                            setCurrentData({
                                                ...currentData,
                                                translations: [
                                                    ...currentData.translations,
                                                    {
                                                        ...initialTranslationState,
                                                        id: currentData.translations.length + 1,
                                                        language_code: language.language_code,
                                                        name: '',
                                                    },
                                                ],
                                            });
                                        }
                                    }}
                                    onChange={(value: string | number) => {
                                        if (
                                            currentData.translations.filter(
                                                (one) =>
                                                    one.language_code === language.language_code,
                                            )?.length
                                        ) {
                                            setCurrentData({
                                                ...currentData,
                                                translations: currentData.translations?.map(
                                                    (one) => {
                                                        if (
                                                            one.language_code ===
                                                            language.language_code
                                                        ) {
                                                            return { ...one, name: String(value) };
                                                        } else {
                                                            return { ...one };
                                                        }
                                                    },
                                                ),
                                            });
                                        } else {
                                            setCurrentData({
                                                ...currentData,
                                                translations: [
                                                    ...currentData.translations,
                                                    {
                                                        ...initialTranslationState,
                                                        id: currentData.translations.length + 1,
                                                        language_code: language.language_code,
                                                        name: String(value),
                                                    },
                                                ],
                                            });
                                        }
                                    }}
                                    type="text"
                                />
                            ))}
                    </>
                </ModalSection>
                <ModalSectionVertical without_margin>
                    <>
                        <ModalSection title={trans('Is Used In System')} size={5}>
                            <SwitchInput
                                size={10}
                                value={!!currentData.is_used_in_system}
                                disabled={mode === 'preview'}
                                onChange={(value: boolean) =>
                                    setCurrentData({
                                        ...currentData,
                                        is_used_in_system: value ? 1 : 0,
                                    })
                                }
                            />
                        </ModalSection>
                        <ModalSection title={trans('Is Default')} size={5}>
                            <SwitchInput
                                size={10}
                                value={!!currentData.is_default}
                                disabled={mode === 'preview'}
                                onChange={(value: boolean) =>
                                    setCurrentData({
                                        ...currentData,
                                        is_default: value ? 1 : 0,
                                    })
                                }
                            />
                        </ModalSection>
                    </>
                </ModalSectionVertical>
                {mode !== 'preview' ? (
                    <ModalActionButton
                        text={mode === 'add' ? trans('Add Language') : trans('Edit Language')}
                        disabled={isPending}
                        loading={isPending}
                        onClick={() => {
                            startTransition(async () => {
                                const result =
                                    mode === 'add'
                                        ? await createLanguageAction(currentData)
                                        : await updateLanguageAction(
                                              currentData.language_code,
                                              currentData,
                                          );
                                if (result.success) {
                                    result.invalidateKeys?.forEach((k) =>
                                        queryClient.invalidateQueries({ queryKey: [k] }),
                                    );
                                    showSuccess(
                                        trans(
                                            mode === 'add' ? 'Language saved' : 'Language updated',
                                        ),
                                    );
                                    onClose();
                                } else {
                                    showError(result.error ?? trans('Failed'));
                                }
                            });
                        }}
                    />
                ) : (
                    <></>
                )}
            </>
        </ModalBody>
    );
}
