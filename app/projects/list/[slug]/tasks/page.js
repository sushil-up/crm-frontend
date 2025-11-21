"use client";
// Import necessary libraries
import { useEffect, useState } from "react";

import TaskService from "@/services/taskservice";
import Loading from "@/app/users/loading";
import { errorMsg, successMsg } from "@/app/toster-msg/msg";
import { Box, Button, Card } from "@mui/material";
import TaskTable from "./tasktable/TaskTable";
import DeleteModal from "@/models/DeleteModal";
import AddTaskModal from "./taskmodal/AddTaskModal";
import useDocumentTitle from "@/app/utils/useDocumentTitle";
import CommonTable from "@/components/CommonTable";
import { taskColumn } from "./tasktable/taskColumn";
import DescriptionModal from "@/models/DescriptionModal";

// Component for a ProjectTasks
function ProjectTasks({ params }) {
  const [taskUser, setTaskusers] = useState([]);
  const [taskCount, setTaskCount] = useState(0);
  const [deleteOpenModal, setDeleteOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [taskId, setTaskId] = useState("");
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [controller, setController] = useState({
    page: 0,
    rowsPerPage: 25,
  });
  const [readMoreModalOpen, setReadMoreModalOpen] = useState(false); // Modal open state
  const [descriptionVal, setDescriptionVal] = useState();
  useDocumentTitle("All Task | Acewebx");
  const projectId = params.slug; // project id
  const handleOpenTaskModal = () => setOpenTaskModal(true);
  const handleCloseTaskModal = () => setOpenTaskModal(false);

  const getData = async () => {
    try {
      const result = await TaskService.allTasks(
        controller.page,
        controller.rowsPerPage,
        projectId
      );
      if (result.data.length == 0) {
        setController({
          ...controller,
          page: 0,
          rowsPerPage: 25,
        });
      }
      setTaskusers(result.data.tasks);
      setTaskCount(result.data.totalCount);
      setLoading(false);
    } catch (error) {
      errorMsg(error?.message);
    }
  };

  // To getting all task data on component mount
  useEffect(() => {
    getData();
  }, [controller]);

  //   handle task open modal
  const handleClickDelete = (id) => {
    setDeleteOpenModal(true);
    setTaskId(id);
  };

  // handle close function for  delete
  const deleteHandleModalClose = () => {
    setDeleteOpenModal(false);
  };

  //  delete task functionlity
  const onDelete = async () => {
    try {
      const result = await TaskService.deleteTask(taskId);
      setLoading(false);
      successMsg(result.message);
      getData();
    } catch (error) {
      errorMsg(error?.message);
    }
    deleteHandleModalClose();
  };

  // for next page pagination
  const handleTaskPageChange = (event, newPage) => {
    setController({
      ...controller,
      page: newPage,
    });
  };
  const handleTakChangeRowsPerPage = (event) => {
    setController({
      ...controller,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0,
    });
  };

  const descriptionHandler = (description) => {
    setReadMoreModalOpen(true);
    setDescriptionVal(description);
  };

  const descriptionHandleModalClose = () => {
    setReadMoreModalOpen(false);
  };
  return (
    <>
      <Box className="flex">
        <Button
          style={{ marginLeft: "auto" }}
          className=" add-page-hover-btn bg-theme-red !text-white !hover:bg-orange-900 !rounded-full w-44 h-14 !mt-2 !mb-2"
          onClick={handleOpenTaskModal}
        >
          Add New Task
        </Button>
      </Box>

      <Card className="bg-white shadow-2xl">
        {loading && <Loading />}
        {/* task  table */}
        {/* <TaskTable
          handleTaskPageChange={handleTaskPageChange}
          handleTakChangeRowsPerPage={handleTakChangeRowsPerPage}
          handleClickDelete={handleClickDelete}
          taskUser={taskUser}
          taskCount={taskCount}
          controller={controller}
        /> */}
          <CommonTable
          data={taskUser}
          column={taskColumn(
            descriptionHandler,
            handleClickDelete,
          )}
          handleChangeRowsPerPage={handleTakChangeRowsPerPage}
          controller={controller}
          userCount={taskCount}
          handlePageChange={handleTaskPageChange}
        />
      </Card>

      {/* task delete modal  */}
      <DeleteModal
        onDelete={onDelete}
        deleteMessage="Are you sure you want to delete this task?"
        deleteOpenModal={deleteOpenModal}
        deleteHandleModalClose={deleteHandleModalClose}
      />
      <AddTaskModal
        params={params}
        handleCloseTaskModal={handleCloseTaskModal}
        openTaskModal={openTaskModal}
        getAllTaskData={getData}
      />
           <DescriptionModal
              descriptionMessage="Task Description"
              descriptionHandleModalClose={descriptionHandleModalClose}
              readMoreModalOpen={readMoreModalOpen}
              descriptionVal={descriptionVal}
            />
    </>
  );
}

export default ProjectTasks;
