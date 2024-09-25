import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal(target) {
  const [open, setOpen] = React.useState(false);
  const history = useHistory()


  const handleClose = () => {
    setOpen(false);
    history.push("/")
  };


  React.useEffect(() => {
    if(target){
      setOpen(true)
    }
  },[])


  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Thankyou for Shopping!
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Your order will be placed once the payment is confirmed.
          </Typography>
        </Box>
        <Button onClick={handleClose}>Back to home</Button>
      </Modal>
    </div>
  );
}