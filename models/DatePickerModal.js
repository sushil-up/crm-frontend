import React from "react";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";
import { Button } from "@mui/material";
export default function DatePickerModal({
  openDateFilter,
  selectionRange,
  setSelectionRange,

  handleFilterRange,
  setOpenDateFilter,
  handleCloseDateModal,
  handleSetDate,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={openDateFilter}
        onClose={handleCloseDateModal}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Data Filter By User"}
        </DialogTitle>
        <DialogContent>
          {openDateFilter ? (
            <div className="date">
              <DateRangePicker
                ranges={[selectionRange]}
                onChange={(ranges) => {
                  setSelectionRange({
                    ...ranges.selection,
                    key: "selection",
                  });
                  handleFilterRange(ranges);
                }}
              />
            </div>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDateFilter(false)} autoFocus>
            close
          </Button>
          <Button onClick={handleSetDate} autoFocus>
            ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
