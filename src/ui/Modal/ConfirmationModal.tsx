import ModalComponent from '@/ui/Modal';
import ModalBody from '@/ui/Modal/ModalBody';
import ModalHeader from '@/ui/Modal/ModalHeader';
import useTrans from '@/utils/translation_util';
import { Button } from '@mui/material';

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  title,
  message
}: ConfirmationModalProps) {
  const trans = useTrans();

  return (
    <ModalComponent open={open}>
      <>
        <ModalHeader
          title={title}
          close={onClose}
          icon={<></>}
          mode="preview"
          clear_button_clk={() => {}}
        />
        <ModalBody>
          <p style={{ textAlign: 'center', marginBottom: '20px' }}>{message}</p>
          <Button
            onClick={onConfirm}
            variant="contained"
            color="error"
            fullWidth
            style={{ marginBottom: '10px' }}
          >
            {trans('Confirm')}
          </Button>
          <Button onClick={onClose} variant="outlined" fullWidth>
            {trans('Cancel')}
          </Button>
        </ModalBody>
      </>
    </ModalComponent>
  );
}
