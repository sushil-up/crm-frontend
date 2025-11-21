"use client";
import React, { useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Card,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Typography,
  Button,
  Tooltip,
} from "@mui/material";
import Link from "next/link";
import moment from "moment";
import DescriptionModal from "@/models/DescriptionModal";
export default function TaskTable({
  taskUser,
  taskCount,
  handleClickDelete,
  controller,
  handleTaskPageChange,
  handleTakChangeRowsPerPage,
}) {
  const [readMoreModalOpen, setReadMoreModalOpen] = useState(false); // Modal open state
  const [descriptionVal, setDescriptionVal] = useState();
  const descriptionHandler = (description) => {
    setReadMoreModalOpen(true);
    setDescriptionVal(description);
  };

  const descriptionHandleModalClose = () => {
    setReadMoreModalOpen(false);
  };
  return (
    <>
      <Table>
        <TableHead className="hour-tablehead bg-stone-200 mt-4">
          <TableRow>
            <TableCell className="p-2.5">Id</TableCell>
            <TableCell className="p-2.5 w-24 ">Title</TableCell>
            <TableCell className="p-2.5 ">Description</TableCell>
            <TableCell className="p-2.5">Status</TableCell>
            <TableCell className="p-2.5">Start Date</TableCell>
            <TableCell className="p-2.5">End Date</TableCell>
            <TableCell className="p-2.5">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {taskUser?.length > 0 ? (
            taskUser.map((task, index) => (
              <TableRow key={index}>
                <TableCell className="p-2.5">
                  {" "}
                  {index + 1 + controller.page * controller.rowsPerPage}
                </TableCell>

                <TableCell className="p-2.5 capitalize">
                  <Tooltip
                    arrow
                    placement="top-start"
                    title={<span>{task.title}</span>}
                  >
                    <span>{`${task.title.slice(0, 30)}`}</span>
                  </Tooltip>
                </TableCell>

                <TableCell className="capitalize">
                  {task.description.length > 35 ? (
                    <span
                      className="text-sm capitaliz min-w-0 cursor-pointer"
                      onClick={() => descriptionHandler(task.description)}
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: task.description.slice(0, 35) || "-",
                        }}
                      />
                      {/* {`${task.description.slice(0, 35)}...`} */}
                    </span>
                  ) : (
                    // <span className="text-sm ">{task.description}</span>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: task.description,
                      }}
                    />
                  )}
                </TableCell>
                <TableCell className="p-2.5">{task.status}</TableCell>
                <TableCell className="p-2.5">
                  {moment(task.start_date).format("YYYY-MM-DD")}
                </TableCell>
                <TableCell className="p-2.5">
                  {moment(task.end_date).format("YYYY-MM-DD")}
                </TableCell>
                <TableCell className="p-2.5">
                  <>
                    <Link href={`/projects/list/144/tasks/update/${task.id}`}>
                      <Button
                        className="!text-green-700 !bg-green-200 !hover:bg-green-300"
                        sx={{ minWidth: "30px" }}
                      >
                        <EditOutlinedIcon className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      className="!text-red-700 !bg-red-100 m-2 !hover:bg-red-200"
                      sx={{ minWidth: "30px" }}
                      onClick={() => handleClickDelete(task.id)}
                    >
                      <DeleteOutlineIcon className="w-4 h-4" />
                    </Button>
                  </>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="7">
                <Typography className="text-red-500 text-center">
                  Data Not Found
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {taskCount !== undefined && (
        <TablePagination
          className="bg-stone-200"
          component="div"
          onPageChange={handleTaskPageChange}
          page={controller.page}
          count={taskCount}
          rowsPerPage={controller.rowsPerPage}
          onRowsPerPageChange={handleTakChangeRowsPerPage}
        />
      )}
      <DescriptionModal
        descriptionMessage="Task Description"
        descriptionHandleModalClose={descriptionHandleModalClose}
        readMoreModalOpen={readMoreModalOpen}
        descriptionVal={descriptionVal}
      />
    </>
  );
}
