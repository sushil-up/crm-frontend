import NotestInput from "@/app/dailyreporting/by-user/notes/NotestInput";
import { Dialog, DialogContent } from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
export default function NotesModal({
  notesModalOpen,
  notesHandleModalClose,
  hoursId,
  updateNotesCount,
  setNotesModalOpen,
  userName,
}) {
  return (
    <div>
      <div>
        <Dialog
          open={notesModalOpen}
          onClose={notesHandleModalClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          maxWidth="md"
        >
          <div className="flex justify-end">
            <CloseIcon
              className="cursor-pointer hover:"
              onClick={() => setNotesModalOpen(false)}
            />
          </div>
          <DialogContent>
            {
              <NotestInput
                hoursId={hoursId}
                updateNotesCount={updateNotesCount}
                userName={userName}
              />
            }
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
