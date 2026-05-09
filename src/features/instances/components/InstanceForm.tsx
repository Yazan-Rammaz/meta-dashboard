import { Instance } from '@/types/instances'; // Will be renamed later
import WhatsappConnectModal from '@/features/integrations/components/WhatsappConnectModal';
import ModalActionButton from '@/ui/Button/modalActionButton';
import Input from '@/ui/Input';
import ModalBody from '@/ui/Modal/ModalBody';
import ModalSection from '@/ui/ModalSection';
import useTrans from '@/utils/translation_util';
import { useEffect, useState } from 'react';
import { useConnectWhatsappMutation } from 'src/services/instances';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

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
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [connectWhatsapp, { isLoading: isConnecting }] = useConnectWhatsappMutation();

  useEffect(() => {
    // Any initialization or data transformation specific to ClientModal
  }, [currentData]);

  async function handleWhatsappCode(code: string) {
    try {
      const result = await connectWhatsapp({ code }).unwrap();
      // Auto-fill form fields with data returned from backend
      setCurrentData({
        ...currentData,
        phone_number_id: result.phone_number_id ?? currentData.phone_number_id,
        whatsapp_business_id: result.whatsapp_business_id ?? currentData.whatsapp_business_id,
        access_token: result.access_token ?? currentData.access_token,
        display_phone_number: result.display_phone_number ?? currentData.display_phone_number,
      });
    } finally {
      setConnectModalOpen(false);
    }
  }

  return (
    <ModalBody>
      <>
        {mode !== 'preview' && (
          <>
            <WhatsappConnectModal
              open={connectModalOpen}
              onClose={() => setConnectModalOpen(false)}
              onCode={handleWhatsappCode}
              isLoading={isConnecting}
            />
            <div style={{ padding: '0 16px 16px' }}>
              <button
                type="button"
                onClick={() => setConnectModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 16px',
                  backgroundColor: '#25D366',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                <WhatsAppIcon fontSize="small" />
                {trans('Connect via WhatsApp')}
              </button>
              <p style={{ fontSize: 11, color: '#888', marginTop: 4 }}>
                {trans('Auto-fills Phone Number ID, Business ID and Access Token')}
              </p>
            </div>
          </>
        )}
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
