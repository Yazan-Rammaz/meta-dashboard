import { ApiKey } from '@/types/api_keys';
import ModalActionButton from '@/ui/Button/modalActionButton';
import Input from '@/ui/Input'; // Import the Input component
import ModalBody from '@/ui/Modal/ModalBody';
import ModalSection from '@/ui/ModalSection';
import useTrans from '@/utils/translation_util';

interface ApiKeyFormProps {
  currentData: ApiKey;
  setCurrentData: (apiKey: ApiKey) => void;
  mode: 'add' | 'update' | 'preview';
  add_button_clk: () => void;
  edit_button_clk: () => void;
}

function ApiKeyForm({
  currentData,
  setCurrentData,
  mode,
  add_button_clk,
  edit_button_clk
}: ApiKeyFormProps) {
  const trans = useTrans();

  const handleFieldChange = (field: keyof ApiKey, value: any) => {
    setCurrentData({
      ...currentData,
      [field]: value
    });
  };

  return (
    <ModalBody>
      <>
        <ModalSection title={trans('Client Details')}>
          <>
            <Input
              title={trans('Label')}
              value={currentData.label || ''}
              onChange={(value) => handleFieldChange('label', value)}
              type="text"
              size={10} // Assuming a default size, adjust as needed
              disabled={mode === 'preview'}
              clear={() => handleFieldChange('label', '')}
            />
            <Input
              title={trans('Rate Limit Per Minute')}
              type="number"
              value={currentData.rate_limit_per_minute ?? ''} // Use nullish coalescing to default to empty string
              onChange={(value) =>
                handleFieldChange(
                  'rate_limit_per_minute',
                  value === '' ? undefined : parseInt(value as string) // Set to undefined if empty
                )
              }
              size={10} // Assuming a default size, adjust as needed
              disabled={mode === 'preview'}
              clear={() =>
                handleFieldChange('rate_limit_per_minute', undefined)
              } // Clear to undefined
            />
          </>
        </ModalSection>

        <ModalSection title={trans('API Key Details')}>
          <>
            <Input
              title={trans('Client ID')}
              value={currentData.client_id || ''}
              type="text"
              size={10}
              disabled={true} // Client ID should not be editable after creation
              clear={() => handleFieldChange('client_id', '')}
              onChange={() => {}}
            />
            <Input
              title={trans('Key Hash')}
              value={currentData.key_hash || ''}
              type="text"
              size={10}
              disabled={true} // Key Hash should not be editable
              clear={() => handleFieldChange('key_hash', '')}
              onChange={() => {}}
            />
            <Input
              title={trans('HMAC Secret')}
              value={currentData.hmac_secret || ''}
              type="text"
              size={10}
              disabled={true} // HMAC Secret should not be editable
              clear={() => handleFieldChange('hmac_secret', '')}
              onChange={() => {}}
            />
          </>
        </ModalSection>

        {mode !== 'preview' ? (
          <ModalActionButton
            text={
              mode === 'add' ? trans('Add API Key') : trans('Update API Key')
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

export default ApiKeyForm;
