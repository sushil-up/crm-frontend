import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
export default function DeleteModal({
  onDelete,
  deleteOpenModal,
  deleteMessage,
  deleteHandleModalClose,
}) {
  return (
    <>
      {" "}
      <Dialog open={deleteOpenModal} onClose={deleteHandleModalClose}>
        <DialogTitle>{"Delete Confirmation"}</DialogTitle>
        <DialogContent>
          <DialogContentText>{deleteMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteHandleModalClose} color="primary">
            Cancel
          </Button>
          <Button onClick={onDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
