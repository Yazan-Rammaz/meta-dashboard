import { User } from '@/types/users';
import ModalActionButton from '@/ui/Button/modalActionButton';
import Input from '@/ui/Input';
import ModalBody from '@/ui/Modal/ModalBody';
import ModalSection from '@/ui/ModalSection';
import Select from '@/ui/Select';
import useTrans from '@/utils/translation_util';
import { useEffect } from 'react';

interface Props {
  currentData: User;
  setCurrentData: (data: User) => void;
  add_button_clk: () => void;
  edit_button_clk: () => void;
  mode: 'add' | 'update' | 'preview';
  initialData: User; // Add initialData prop to reset to
}

export default function UserForm({
  currentData,
  setCurrentData,
  mode,
  add_button_clk,
  edit_button_clk,
  initialData
}: Props) {
  const trans = useTrans();

  const reset_button_clk = () => {
    setCurrentData(initialData);
  };

  useEffect(() => {
    // Any initialization or data transformation specific to UserModal
  }, [currentData]);

  return (
    <ModalBody>
      <>
        <ModalSection title={trans('User Details')}>
          <>
            <Input
              size={4}
              title={trans('Name')}
              value={currentData.name || ''}
              disabled={mode === 'preview'}
              clear={() => {
                setCurrentData({
                  ...currentData,
                  name: ''
                });
              }}
              onChange={(value: string | number) => {
                setCurrentData({
                  ...currentData,
                  name: String(value)
                });
              }}
              type="text"
            />
            <Input
              size={4}
              title={trans('Email')}
              value={currentData.email || ''}
              disabled={mode === 'preview'}
              clear={() => {
                setCurrentData({
                  ...currentData,
                  email: ''
                });
              }}
              onChange={(value: string | number) => {
                setCurrentData({
                  ...currentData,
                  email: String(value)
                });
              }}
              type="email"
            />
            {mode === 'add' && (
              <Input
                size={4}
                title={trans('Password')}
                value={currentData.password || ''}
                disabled={false} // Changed from mode === 'preview' to false
                clear={() => {
                  setCurrentData({
                    ...currentData,
                    password: ''
                  });
                }}
                onChange={(value: string | number) => {
                  setCurrentData({
                    ...currentData,
                    password: String(value)
                  });
                }}
                type="password"
                showPasswordToggle={true}
              />
            )}

            <Select
              size={4}
              title={trans('Role')}
              value={currentData.role || ''}
              disabled={mode === 'preview'}
              onChange={(value: string | number) => {
                setCurrentData({
                  ...currentData,
                  role: String(value)
                });
              }}
              options={[
                { value: 'admin', label: 'Admin' },
                { value: 'user', label: 'User' },
                { value: 'editor', label: 'Editor' }
              ]}
            />
            <Input
              size={4}
              title={trans('Status')}
              value={currentData.status || ''}
              disabled={mode === 'preview'}
              clear={() => {
                setCurrentData({
                  ...currentData,
                  status: ''
                });
              }}
              onChange={(value: string | number) => {
                setCurrentData({
                  ...currentData,
                  status: String(value)
                });
              }}
              type="text"
            />
          </>
        </ModalSection>
        {mode !== 'preview' ? (
          <ModalActionButton
            text={mode === 'add' ? trans('Add User') : trans('Edit User')}
            disabled={false}
            onClick={() => {
              if (mode === 'add') {
                add_button_clk();
              } else {
                edit_button_clk();
              }
            }}
          />
        ) : (
          <></>
        )}
        {mode !== 'preview' && (
          <ModalActionButton
            text={trans('Reset')}
            disabled={false}
            onClick={reset_button_clk}
          />
        )}
      </>
    </ModalBody>
  );
}
