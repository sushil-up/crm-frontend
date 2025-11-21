import React, { useEffect, useState } from "react";

import {
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Box,
  TablePagination,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DescriptionModal from "@/models/DescriptionModal";
import OverallFeedbackModal from "@/models/OverallFeedbackModal";

export default function EmployeeTable({
  totalEmployee,
  controller,
  handleEdit,
  tableData,
  adminUser,
  currentUser,
  handleClickOpen,
  checkAdminHandler,
  handlePageChange,
  handleChangeRowsPerPage,
}) {

  
  const [readMoreModalOpen, setReadMoreModalOpen] = useState(false); // Modal open state
  const [modalOpen, setModalOpen] = useState(false); // Modal open state
  const [descriptionVal, setDescriptionVal] = useState();
  const [productivity, setProductivity] = useState();
  const [communication, setCommunication] = useState();
  const [dependentOther, setDependOther] = useState();
  const [problemSolving, setProblemSolving] = useState();
  const [dateTime, setDateTime] = useState();
  const [nonBillableReason, setNonBillableReason] = useState();
  const [isBillableReason, setIsBillableReason] = useState();
  const [avg, setAvg] = useState([]); // average state

  // feedback modal close
  const descriptionHandleModalClose = () => {
    setReadMoreModalOpen(false);
  };
  // Overall feedback modal close
  const feedbackHandleModalClose = () => {
    setModalOpen(false);
  };
  // Overall feedback handler
  const feedbackHandler = (
    productivity,
    dependentOther,
    communication,
    problemSolving,
    createdAt,
    nonReason,
    isBillable
  ) => {
    setModalOpen(true);
    setProductivity(productivity);
    setDependOther(dependentOther);
    setCommunication(communication);
    setProblemSolving(problemSolving);
    setDateTime(createdAt);
    setNonBillableReason(nonReason);
    setIsBillableReason(isBillable);
  };
  // Feedback handler
  const descriptionHandler = (
    description,
    createdAt,
    nonReason,
    isBillable
  ) => {
    setReadMoreModalOpen(true);
    setDescriptionVal(description);
    setDateTime(createdAt);
    setNonBillableReason(nonReason);
    setIsBillableReason(isBillable);
  };

  // Calculate average for rating
  useEffect(() => {
    if (tableData?.length > 0) {
      const averages = tableData.map((item) => {
        const sum =
          (parseInt(item.communication) +
            parseInt(item.dependent_on_other) +
            parseInt(item.problem_solving) +
            parseInt(item.productivity)) /
          4;
        return { sum, employee: item.select_employee };
      });
      setAvg(averages.map((a) => a.sum));
    } else {
      setAvg([]);
    }
  }, [tableData]);
  const itemCount = Array.isArray(totalEmployee)
    ? totalEmployee.length
    : totalEmployee;

  return (
    <div className="bg-white shadow-2xl mt-10">
      <Table>
        <TableHead className="hour-tablehead bg-stone-200">
          <TableRow>
            <TableCell className="!p-4 bg-theme-color !text-white">
              Id
            </TableCell>
            <TableCell className="!p-4 bg-theme-color !text-white">
              Employee
            </TableCell>
            <TableCell className="!p-4 bg-theme-color !text-white">
              Project
            </TableCell>
            <TableCell className="!p-4 bg-theme-color !text-white">
              Feedback
            </TableCell>
            <TableCell className="!p-4 bg-theme-color !text-white">
              Overall <br />
              Performance
            </TableCell>
            <TableCell className="!p-4 bg-theme-color !text-white">
              Overall <br />
              Feedback
            </TableCell>
            <TableCell className="!p-4 bg-theme-color !text-white">
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData?.length > 0 ? (
            tableData
              .sort((a, b) => {
                const nameA = a.select_employee?.toUpperCase() || "";
                const nameB = b.select_employee?.toUpperCase() || "";
                return nameA.localeCompare(nameB); // Simplified sorting
              })
              .map((user, index) => {
                const average = avg[index];
                let color = "";
                if (average < 5) {
                  color = "!text-red-700";
                } else if (average >= 5 && average < 8) {
                  color = "!text-yellow-500";
                } else if (average >= 8) {
                  color = "!text-green-700";
                }
                return (
                  <TableRow key={index}>
                    <TableCell className="!p-4 !font-semibold">
                      {index + 1 + controller?.page * controller?.rowsPerPage}
                    </TableCell>
                    <TableCell className="!p-4 capitalize">
                      {user?.userName}
                    </TableCell>
                    <TableCell className="!p-4">
                      {user?.projectName}
                    </TableCell>
                    <TableCell className="!p-4">
                      <span
                        onClick={() =>
                          descriptionHandler(
                            user.feedback,
                            user.createdAt,
                            user.nonBillableReason,
                            user.is_billable
                          )
                        }
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        {user.feedback.length > 20
                          ? `${user.feedback.slice(0, 26)}...`
                          : user.feedback}
                      </span>
                    </TableCell>
                    <TableCell className="!p-4">
                      <Box position="relative" display="inline-flex">
                        <CircularProgress
                          className={color}
                          variant="determinate"
                          value={(average / 10) * 100}
                        />
                        <Box
                          top={0}
                          left={0}
                          bottom={0}
                          right={0}
                          position="absolute"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Typography
                            bgcolor={color}
                            variant="caption"
                            component="div"
                            color="textSecondary"
                          >
                            {average}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell className="!p-4 capitalize">
                      <span
                        onClick={() =>
                          feedbackHandler(
                            user.productivity_feedback,
                            user.communication_feedback,
                            user.problem_solving_feedback,
                            user.dependent_other_feedback,
                            user.createdAt,
                            user.nonBillableReason,
                            user.is_billable
                          )
                        }
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        {user.productivity_feedback.length > 10
                          ? `${user.productivity_feedback.slice(0, 10)}...`
                          : user.productivity_feedback}
                      </span>
                    </TableCell>
                  
                    <TableCell className="!p-4">
                      {adminUser !== "true" || user.id === currentUser ? (
                        <>
                          <Button
                            className="!text-green-700 !bg-green-200 hover:!bg-green-300"
                            sx={{ minWidth: "30px" }}
                            onClick={() => handleEdit(user.id)}
                          >
                            <Tooltip title="Edit">
                              <EditOutlinedIcon className="!w-4 !h-4" />
                            </Tooltip>
                          </Button>
                          <Button
                            className="!text-red-700 !bg-red-100 !m-2 hover:!bg-red-200"
                            sx={{ minWidth: "30px" }}
                            onClick={() => handleClickOpen(user.id)}
                          >
                            <Tooltip title="Delete">
                              <DeleteOutlineIcon className="!w-4 !h-4" />
                            </Tooltip>
                          </Button>
                        </>
                      ) : (
                        <>
                          <Tooltip
                            arrow
                            placement="top-start"
                            title="You are not authorized to edit"
                          >
                            <Button
                              className="!text-green-700 !bg-green-200 hover:!bg-green-300 cursor-not-allowed"
                              sx={{ minWidth: "30px" }}
                            >
                              <EditOutlinedIcon className="!w-4 !h-4" />
                            </Button>
                          </Tooltip>
                          <Tooltip
                            arrow
                            placement="top-start"
                            title="You are not authorized to delete"
                          >
                            <Button
                              className="!text-red-700 !bg-red-100 !m-2 hover:!bg-red-200 cursor-not-allowed"
                              sx={{ minWidth: "30px" }}
                            >
                              <DeleteOutlineIcon className="!w-4 !h-4" />
                            </Button>
                          </Tooltip>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
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
      <TablePagination
        className="bg-white text-black custom-pagination"
        component="div"
        onPageChange={handlePageChange}
        page={controller?.page}
        count={itemCount}
        rowsPerPage={controller?.rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <DescriptionModal
        descriptionMessage="Review Feedback"
        descriptionHandleModalClose={descriptionHandleModalClose}
        readMoreModalOpen={readMoreModalOpen}
        descriptionVal={descriptionVal}
        dateTime={dateTime}
        nonBillableReason={nonBillableReason}
        isBillableReason={isBillableReason}
      />
      <OverallFeedbackModal
        descriptionMessage="Overall Feedback"
        feedbackHandleModalClose={feedbackHandleModalClose}
        modalOpen={modalOpen}
        productivity={productivity}
        problemSolve={problemSolving}
        dependOther={dependentOther}
        communication={communication}
        dateTime={dateTime}
        nonBillableReason={nonBillableReason}
        isBillableReason={isBillableReason}
      />
    </div>
  );
}
