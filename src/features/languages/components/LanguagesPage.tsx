import ListComponent from '@/components/List';
import ListItemComponent from '@/components/List/ListItem';
import { TopNav } from '@/features/shared/components/DashboardShared';
import LanguagesIcon from '@/ui/icons/languages.svg';
import Image from 'next/image';
import {
  useGetlanguagesQuery,
  useAddLanguageMutation,
  useUpdateLanguageMutation,
  useDeleteLanguageMutation
} from 'src/services/languages';
import SuspenseLoader from '@/components/SuspenseLoader';
import LanguageModal from '@/features/languages/components/LanguageModal';
import { useEffect, useState } from 'react';
import { Language } from '@/models/languages';
import ModalComponent from '@/ui/Modal';
import ModalHeader from '@/ui/Modal/ModalHeader';
import useTrans from '@/utils/translation_util';
import { Helmet } from 'react-helmet-async';
import EmptyIcon from '@/ui/icons/emptyIcon.svg';
import ShowTrans, { transformTranslations } from '@/utils/showTrans';

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
  isAddSuccess
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
                          src={currentData?.flat_photo_path || EmptyIcon.src}
                          alt="Language Flag Icon"
                          width={15}
                          height={15}
                          style={{
                            marginRight: '10px'
                          }}
                        />{' '}
                        {ShowTrans({
                          Translations: transformTranslations(
                            currentData?.translations || []
                          ),
                          field_name: 'name'
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
                        mode
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
                        mode
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
              deleteItem={() => deleteItem && deleteItem(element)}
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
                    marginRight: '10px'
                  }}
                />{' '}
                {ShowTrans({
                  Translations: transformTranslations(element.translations),
                  field_name: 'name'
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
  son_languages: []
};
export default function Languages() {
  const trans = useTrans();

  const { data: Languages, isLoading: isLoadingLanguages } =
    useGetlanguagesQuery();
  const [
    addLanguage,
    {
      isLoading: isAddLoading,
      isSuccess: isAddSuccess,
      isError: isAddError,
      reset: resetAdd
    }
  ] = useAddLanguageMutation();
  const [
    updateLanguage,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      reset: resetUpdate
    }
  ] = useUpdateLanguageMutation();
  const [
    deleteLanguage,
    {
      isLoading: isDeleteLoading,
      isSuccess: isDeleteSuccess,
      isError: isDeleteError,
      reset: resetDelete
    }
  ] = useDeleteLanguageMutation();
  const [open, setOpen] = useState<boolean>(false);
  const [mode, setMode] = useState<'add' | 'update' | 'preview' | null>(null);
  const [currentData, setCurrentData] = useState<Language>(initialState);

  useEffect(() => {
    const timeout = setTimeout(() => {
      resetAdd();
      resetDelete();
      resetUpdate();
    }, 1500);
    return () => clearTimeout(timeout);
  }, [
    isAddSuccess,
    isAddError,
    isUpdateError,
    isUpdateSuccess,
    isDeleteSuccess,
    isDeleteError
  ]);

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
                isLoading={isAddLoading}
                isSuccess={isAddSuccess}
                isError={isAddError}
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
                      marginRight: '10px'
                    }}
                  />{' '}
                  {ShowTrans({
                    Translations: transformTranslations(
                      currentData.translations
                    ),
                    field_name: 'name'
                  })}
                </>
              </ListItemComponent>
            ) : (
              <></>
            )}
            {MapElements({
              isUpdateLoading,
              isUpdateSuccess,
              isUpdateError,
              isDeleteLoading,
              isDeleteSuccess,
              isDeleteError,
              isAddLoading,
              isAddSuccess,
              isAddError,
              mode: mode as 'add' | 'update' | 'preview',
              add_in: currentData.parent_language_code,
              currentData,
              elements: Languages ?? [],
              setOpen,
              setElement: setCurrentData,
              setMode,
              updating:
                isUpdateLoading && currentData.id ? currentData.id : undefined,
              addChild: (element: Language) => {
                setMode('add');
                setOpen(true);
                setCurrentData({
                  ...initialState,
                  parent_language_code: element.language_code
                });
              },
              deleteItem: (item: Language) => {
                deleteLanguage(item);
                setOpen(false);
                setCurrentData(initialState);
              }
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
                  deleteLanguage(currentData);
                  setOpen(false);
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
                            currentData.translations
                          ),
                          field_name: 'name'
                        })
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
                    parent_language_code: currentData.language_code
                  });
                }}
                clear_button_clk={() => {
                  if (mode === 'update') {
                    const foundLanguage = Languages?.filter(
                      (one) => one.id === currentData.id
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
                add_button_clk={() => {
                  addLanguage(currentData);
                  setOpen(false);
                  setCurrentData(initialState);
                }}
                edit_button_clk={() => {
                  updateLanguage(currentData);
                  setOpen(false);
                  setMode('preview');
                }}
              />
            </>
          </ModalComponent>
        }
      </div>
    </>
  );
}
