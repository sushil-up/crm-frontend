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
import FormInput from "@/components/share/forminputs/FormInput";

export default function OverallFeedbackModal({
  dateTime,
  nonBillableReason,
  feedbackHandleModalClose,
  modalOpen,
  descriptionMessage,
  isBillableReason,
  productivity,
  problemSolve,
  dependOther,
  communication,
}) {
  const { control } = useForm();



  
  return (
    <div>
      <Dialog
        open={modalOpen}
        onClose={feedbackHandleModalClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <b>{descriptionMessage}</b>
          {dateTime && (
            <Typography className="description-timedate">
              {moment(dateTime).format("D MMM YYYY, h:mm a")}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <Typography className="font-semibold" variant="h6">Productivity</Typography>
          <FormInput
            className="relative description-area pb-12"
            name="productivity"
            control={control}
            value={productivity}
            multiline
          />
          
          <Typography className="font-semibold" variant="h6">Communication</Typography>
          <FormInput
            className="relative description-area pb-12"
            name="communication"
            control={control}
            value={communication}
            multiline
          />
          
          <Typography className="font-semibold" variant="h6">Problem Solving</Typography>
          <FormInput
            className="relative description-area pb-12"
            name="problemSolve"
            control={control}
            value={problemSolve}
            multiline
          />
          
          <Typography className="font-semibold" variant="h6">Dependability</Typography>
          <FormInput
            className="relative description-area pb-12"
            name="dependOther"
            control={control}
            value={dependOther}
            multiline
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
            ""
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={feedbackHandleModalClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
