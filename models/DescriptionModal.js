import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import moment from "moment";
import { getReadableText } from "@/app/utils/fortextcss/ReadableText";
import FormInput from "@/components/share/forminputs/FormInput";

export default function DescriptionModal({
  dateTime,
  nonBillableReason,
  descriptionHandleModalClose,
  readMoreModalOpen,
  descriptionMessage,
  descriptionVal,
  isBillableReason,
}) {
  const { control } = useForm();
  let newData = getReadableText(descriptionVal);

  const processedDescription = (descriptionVal || '').replace(
    /<a /g,
    '<a target="_blank" rel="noopener noreferrer" '
  );

  return (
    <div>
      <Dialog
        open={readMoreModalOpen}
        onClose={descriptionHandleModalClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <b>{descriptionMessage}</b>
          {dateTime && (
            <Typography className="description-timedate">
              {moment(dateTime).format("D MMM  YYYY, h:mm a")}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <div
            dangerouslySetInnerHTML={{
              __html: processedDescription,
            }}
          />

          {isBillableReason == 0 ? (
            <>
              <br />
              <DialogTitle className="!p-0 ">
                <b>Non Billable Reason</b>
              </DialogTitle>
              <Typography>{nonBillableReason}</Typography>
            </>
          ) : (
            ''
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={descriptionHandleModalClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
