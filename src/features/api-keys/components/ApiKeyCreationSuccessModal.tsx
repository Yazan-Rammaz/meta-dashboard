import { PermissionKey } from '@/types/permissions';
import ModalComponent from '@/ui/Modal';
import ModalBody from '@/ui/Modal/ModalBody'; // Import ModalBody
import ModalHeader from '@/ui/Modal/ModalHeader';
import useTrans from '@/utils/translation_util';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField
} from '@mui/material';
import { useState } from 'react';

interface ApiKeyCreationSuccessModalProps {
  open: boolean;
  onClose: () => void;
  apiKey: string;
  hmacSecret: string;
}

export default function ApiKeyCreationSuccessModal({
  open,
  onClose,
  apiKey,
  hmacSecret
}: ApiKeyCreationSuccessModalProps) {
  const trans = useTrans();
  const [copiedKeys, setCopiedKeys] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showHmacSecret, setShowHmacSecret] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // You might want to add a toast notification here
  };

  return (
    <ModalComponent open={open}>
      <>
        <ModalHeader
          title={trans('API Key Created Successfully')}
          close={() => {
            if (copiedKeys) {
              onClose();
            }
          }}
          icon={<></>}
          add_permission={PermissionKey.API_KEYS_CREATE}
          update_permission={PermissionKey.API_KEYS_UPDATE}
          delete_permission={PermissionKey.API_KEYS_DELETE}
          revoke_permission={PermissionKey.API_KEYS_REVOKE}
          mode="preview"
          clear_button_clk={() => {}}
        />
        <ModalBody>
          <p>
            {trans(
              'Please copy and save these keys securely. They will not be shown again.'
            )}
          </p>

          <TextField
            label="API Key"
            value={showApiKey ? apiKey : '********'}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle api key visibility"
                    onClick={() => setShowApiKey(!showApiKey)}
                    edge="end"
                  >
                    {showApiKey ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                  <Button onClick={() => handleCopy(apiKey)} variant="outlined">
                    {trans('Copy')}
                  </Button>
                </InputAdornment>
              )
            }}
          />

          <TextField
            label="HMAC Secret"
            value={showHmacSecret ? hmacSecret : '********'}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle hmac secret visibility"
                    onClick={() => setShowHmacSecret(!showHmacSecret)}
                    edge="end"
                  >
                    {showHmacSecret ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                  <Button
                    onClick={() => handleCopy(hmacSecret)}
                    variant="outlined"
                  >
                    {trans('Copy')}
                  </Button>
                </InputAdornment>
              )
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={copiedKeys}
                onChange={(e) => setCopiedKeys(e.target.checked)}
                color="primary"
              />
            }
            label={trans('I have copied and saved these keys securely')}
          />

          <Button
            onClick={() => onClose()}
            disabled={!copiedKeys}
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '20px' }}
          >
            {trans('Close')}
          </Button>
        </ModalBody>
      </>
    </ModalComponent>
  );
}
