"use client";

import { Button, Modal } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Addtasks from "../add/page";
export default function AddTaskModal({
  params,
  handleCloseTaskModal,
  openTaskModal,
  getAllTaskData,
}) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 900,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Modal
        open={openTaskModal}
        onClose={handleCloseTaskModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            component="div"
            id="modal-modal-description"
            sx={{ mt: 2 }}
          >
            <Addtasks
              params={params}
              handleCloseTaskModal={handleCloseTaskModal}
              getAllTaskData={getAllTaskData}
            />
            <Button
              className="task-close-button h-12 !hover:bg-red-800 text-[18px] cursor-pointer !rounded-full w-28"
              variant="outlined"
              color="error"
              onClick={handleCloseTaskModal}
            >
              Close
            </Button>
          </Typography>
        </Box>
      </Modal>
    </>
  );
}
