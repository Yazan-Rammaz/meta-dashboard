import { User } from '@/types/users';
import ModalActionButton from '@/ui/Button/modalActionButton';
import Input from '@/ui/Input';
import ModalBody from '@/ui/Modal/ModalBody';
import ModalSection from '@/ui/ModalSection';
import useTrans from '@/utils/translation_util';
import { useEffect } from 'react';

interface Props {
  currentData: User;
  setCurrentData: (data: User) => void;
  add_button_clk: () => void;
  edit_button_clk: () => void;
  mode: 'add' | 'update' | 'preview';
}

export default function UserForm({
  currentData,
  setCurrentData,
  mode,
  add_button_clk,
  edit_button_clk
}: Props) {
  const trans = useTrans();

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

            <Input
              size={4}
              title={trans('Role')}
              value={currentData.role || ''}
              disabled={mode === 'preview'}
              clear={() => {
                setCurrentData({
                  ...currentData,
                  role: ''
                });
              }}
              onChange={(value: string | number) => {
                setCurrentData({
                  ...currentData,
                  role: String(value)
                });
              }}
              type="text"
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
      </>
    </ModalBody>
  );
}
