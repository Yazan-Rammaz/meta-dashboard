import { Instance } from '@/types/instances'; // Will be renamed later
import ModalActionButton from '@/ui/Button/modalActionButton';
import Input from '@/ui/Input';
import ModalBody from '@/ui/Modal/ModalBody';
import ModalSection from '@/ui/ModalSection';
import useTrans from '@/utils/translation_util';
import { useEffect } from 'react';

interface Props {
  currentData: Instance;
  setCurrentData: (data: Instance) => void;
  add_button_clk: () => void;
  edit_button_clk: () => void;
  mode: 'add' | 'update' | 'preview';
}

export default function InstanceForm({
  currentData,
  setCurrentData,
  mode,
  add_button_clk,
  edit_button_clk
}: Props) {
  const trans = useTrans();

  useEffect(() => {
    // Any initialization or data transformation specific to ClientModal
  }, [currentData]);

  return (
    <ModalBody>
      <>
        <ModalSection title={trans('Instance Details')}>
          <>
            <Input
              size={4}
              title={trans('Instance Name')}
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
              title={trans('Display Phone Number')}
              value={currentData.display_phone_number || ''}
              disabled={mode === 'preview'}
              clear={() => {
                setCurrentData({
                  ...currentData,
                  display_phone_number: ''
                });
              }}
              onChange={(value: string | number) => {
                setCurrentData({
                  ...currentData,
                  display_phone_number: String(value)
                });
              }}
              type="text"
            />
            <Input
              size={4}
              title={trans('Phone Number ID')}
              value={currentData.phone_number_id || ''}
              disabled={mode === 'preview'}
              clear={() => {
                setCurrentData({
                  ...currentData,
                  phone_number_id: ''
                });
              }}
              onChange={(value: string | number) => {
                setCurrentData({
                  ...currentData,
                  phone_number_id: String(value)
                });
              }}
              type="text"
            />
            <Input
              size={4}
              title={trans('Whatsapp Business ID')}
              value={currentData.whatsapp_business_id || ''}
              disabled={mode === 'preview'}
              clear={() => {
                setCurrentData({
                  ...currentData,
                  whatsapp_business_id: ''
                });
              }}
              onChange={(value: string | number) => {
                setCurrentData({
                  ...currentData,
                  whatsapp_business_id: String(value)
                });
              }}
              type="text"
            />
            <Input
              size={4}
              title={trans('Webhook URL')}
              value={currentData.webhook_url || ''}
              disabled={mode === 'preview'}
              clear={() => {
                setCurrentData({
                  ...currentData,
                  webhook_url: null
                });
              }}
              onChange={(value: string | number) => {
                setCurrentData({
                  ...currentData,
                  webhook_url: value === '' ? null : String(value)
                });
              }}
              type="text"
            />
            <Input
              size={4}
              title={trans('Rate Limit Per Minute')}
              value={currentData.rate_limit_per_minute?.toString() || ''}
              disabled={mode === 'preview'}
              clear={() => {
                setCurrentData({
                  ...currentData,
                  rate_limit_per_minute: 0
                });
              }}
              onChange={(value: string | number) => {
                setCurrentData({
                  ...currentData,
                  rate_limit_per_minute: Number(value)
                });
              }}
              type="number"
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
            text={
              mode === 'add' ? trans('Add Instance') : trans('Edit Instance')
            }
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
