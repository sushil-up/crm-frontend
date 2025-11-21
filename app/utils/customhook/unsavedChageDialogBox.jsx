import React, { createContext, useState, useContext } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UnsavedChangesDialogContext = createContext();

export const useUnsavedChangesDialog = () => useContext(UnsavedChangesDialogContext);

export const UnsavedChangesDialogProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [resolvePromise, setResolvePromise] = useState(null);
  const [message, setMessage] = useState("You have unsaved changes. Are you sure you want to leave?");

  const showDialog = (customMessage) => {
    setMessage(customMessage);
    setOpen(true);
    return new Promise((resolve) => {
      setResolvePromise(() => resolve);
    });
  };

  const handleClose = (confirmed) => {
    setOpen(false);
    resolvePromise && resolvePromise(confirmed);
  };

  return (
    <UnsavedChangesDialogContext.Provider value={{ showDialog }}>
      {children}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => handleClose(false)}
      >
        <DialogTitle>{"Unsaved Changes"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)}>Cancel</Button>
          <Button onClick={() => handleClose(true)} autoFocus>
            Leave
          </Button>
        </DialogActions>
      </Dialog>
    </UnsavedChangesDialogContext.Provider>
  );
};
