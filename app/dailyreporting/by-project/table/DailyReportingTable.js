import DataNotFound from "@/components/DataNotFound";
import Link from "next/link";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import DescriptionIcon from "@mui/icons-material/Description";

import React, { useState } from "react";
import moment from "moment";
import DeleteModal from "@/models/DeleteModal";
import HourLogsService from "@/services/hourlogservice";
import { useSession } from "next-auth/react";
import HoursEditModal from "@/models/HoursEditModal";
import { ItemMenu } from "../../by-user/table/ItemMenu";

export default function DailyReportingTable({
  hasScrolled,
  hoursData,
  descriptionHandler,
  notesHandler,
  getAllData,
  filters,
}) {
  const session = useSession();

  //total of billable or non billable hours
  const calculateTotalHours = (projectTasks, isBillable) => {
    let totalMinutes = projectTasks.reduce((acc, innerItem) => {
      if (innerItem.is_billable === isBillable) {
        if (innerItem.hours.includes(":")) {
          const [hours, minutes] = innerItem.hours.split(":").map(parseFloat);
          return acc + hours * 60 + minutes;
        } else {
          return acc + parseFloat(innerItem.hours) * 60;
        }
      }
      return acc;
    }, 0);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes}`;
  };

  const [deleteOpenModal, setDeleteOpenModal] = useState(false); // Modal open state
  const [deleteId, setDeleteId] = useState(null); // Id to be deleted

  const [editOpenModal, setEditOpenModal] = useState(false); // Modal open state
  const [editId, setEditId] = useState(null); // Modal open state
  // Function for delete functionality
  const onDelete = async () => {
    try {
      const result = await HourLogsService.deleteHoursById(deleteId);
      deleteHandleModalClose();
      successMsg(result.message);
      setLoading(false);

      // getAllHoursData(page, pageSize, filters);
    } catch (error) {
      errorMsg(error?.message);
    }
  };

  const handleHoursDelete = (id) => {
    setDeleteId(id);
    setDeleteOpenModal(true);
  };

  // Function to Hours close the modal
  const deleteHandleModalClose = () => {
    setDeleteOpenModal(false);
  };

  const HandleEditModalClose = () => {
    setEditOpenModal(false);
  };

  const editModalhandleOpen = (id) => {
    setEditId(id);
    setEditOpenModal(true);
  };
  return (
    <>
      <div className={`table-header ${hasScrolled ? "fixed-header" : ""}`}>
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 650 }}
            aria-label="simple table"
            className="table-fixed"
          >
            <TableHead>
              <TableRow className="">
                <TableCell className="!font-semibold !text-white !border-slate-800 ">
                  Project Name
                </TableCell>
                <TableCell className="!font-semibold !text-white !border-slate-800 ">
                  Task Name
                </TableCell>
                <TableCell className="!font-semibold !text-white !border-slate-800 ">
                  Description
                </TableCell>
                <TableCell className="!font-semibold !text-white !border-slate-800 ">
                  Hours By T.L
                </TableCell>
                <TableCell className="!font-semibold !text-white !border-slate-800 ">
                  Billable
                </TableCell>
                <TableCell className="!font-semibold !text-white !border-slate-800 ">
                  Non Billable
                </TableCell>
                <TableCell className="!font-semibold !text-white !border-slate-800 ">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
      </div>
      {hoursData?.length ? (
        <>
          <div className="bg-transparent">
            {hoursData.map((users, index) => {
              return (
                <Accordion
                  key={index}
                  defaultExpanded={true}
                  className="!bg-transparent fgdgfdghfdgh"
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className="!bg-[#FFE3E4] !mt-5 !mb-5 totalbarcontent"
                  >
                    <div className="total-content-bar">
                      <Typography className="capitalize">
                        <b>{moment(users.date).format("MMM D, YYYY")}</b>
                      </Typography>
                      <Typography className="capitalize">
                        {(() => {
                          let totalAbsent = 0;
                          // users?.projects?.forEach((user) => {
                          //   if (user?.billableHours !== null && user?.nonBillableHours !== null) {
                          //     totalAbsent++;
                          //   }
                          // });
                          const uniqueUsers = new Set();
                          users?.projects?.forEach((project) => {
                            project?.projectTasks?.forEach((task) => {
                              const userName = task?.userName;

                              if (userName && !uniqueUsers.has(userName)) {
                                uniqueUsers.add(userName);

                                if (task?.is_billable !== null) {
                                  totalAbsent++;
                                }
                              }
                            });
                          });

                          return (
                            <>
                              Bandwidth({totalAbsent}) :{" "}
                              <b>{totalAbsent * 8}</b>
                            </>
                          );
                        })()}
                      </Typography>
                      <Typography className="capitalize">
                        Total Hours : <b>{users.totalHours}</b>
                      </Typography>
                      <Typography className="capitalize">
                        T.L Hours : <b>{users?.hoursByTL}</b>
                      </Typography>
                      <Typography className="capitalize">
                        Billable : <b>{users?.billableHours}</b>
                      </Typography>
                      <Typography className="capitalize">
                        Non Billable : <b>{users?.nonBillableHours}</b>
                      </Typography>
                    </div>
                  </AccordionSummary>

                  {users.projects.map((user) => {
                    const totalBillableHoursItem = calculateTotalHours(
                      user.projectTasks,
                      1
                    );
                    const totalNonBillableHoursItem = calculateTotalHours(
                      user.projectTasks,
                      0
                    );

                    return (
                      <div key={user.id}>
                        <AccordionDetails
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                          className="grid grid-cols-7 bg-[#514E4F] text-white items-center !p-4 gap-[24px]"
                          sx={{ display: "" }}
                        >
                          <Typography className="capitalize">
                            <b>{user.title}</b>
                          </Typography>

                          <Typography className="capitalize">
                            <b>{moment(users.date).format("MMM Do")} </b>
                            <b>{user.totalHours}</b>
                          </Typography>
                          <Typography className="capitalize">
                            Total Hours : <b>{user.totalHours}</b>
                          </Typography>
                          <Typography className="capitalize">
                            T.L Hours : <b>{user?.hoursByTL}</b>
                          </Typography>
                          <Typography className="capitalize">
                            Billable : <b>{user?.billableHours}</b>
                          </Typography>
                          <Typography className="capitalize">
                            Non Billable : <b>{user?.nonBillableHours}</b>
                          </Typography>
                          <Typography className="capitalize">
                            Action :
                          </Typography>
                        </AccordionDetails>

                        <AccordionDetails className=" !p-0 mb-5">
                          <TableContainer component={Paper}>
                            <Table
                              sx={{ minWidth: 650 }}
                              aria-label="simple table"
                              className="!p-0"
                            >
                              <TableHead className="hour-tablehead"></TableHead>
                              <TableBody className="!p-0 ">
                                {user.projectTasks.map((item) => (
                                  <TableRow
                                    key={item.hourId}
                                    sx={{
                                      "&:last-child td, &:last-child th": {
                                        border: 0,
                                      },
                                    }}
                                  >
                                    <TableCell className="w-[152px]">
                                      <Tooltip
                                        arrow
                                        placement="top-start"
                                        title={<span>{item.userName}</span>}
                                      >
                                        <span>{`${item.userName.slice(
                                          0,
                                          30
                                        )}`}</span>
                                      </Tooltip>
                                    </TableCell>
                                    <TableCell className="w-[192px]">
                                      <Tooltip
                                        arrow
                                        placement="top-start"
                                        title={<span>{item.taskName}</span>}
                                      >
                                        <span>{`${item.taskName.slice(
                                          0,
                                          30
                                        )}`}</span>
                                      </Tooltip>
                                    </TableCell>

                                    <TableCell className="w-[92px]">
                                      {item?.description?.length ? (
                                        <DescriptionIcon
                                          className=" text-zinc-400 cursor-pointer "
                                          onClick={() =>
                                            descriptionHandler(
                                              item.description,
                                              item.createdAt,
                                              item.nonBillableReason
                                            )
                                          }
                                        />
                                      ) : (
                                        "-"
                                      )}
                                    </TableCell>
                                    <TableCell className="w-48">
                                      {item?.hoursByTL ? item?.hoursByTL : "-"}
                                    </TableCell>

                                    <TableCell className="w-48">
                                      {item.is_billable === 1
                                        ? item.hours
                                        : "-"}
                                    </TableCell>

                                    <TableCell className="relative w-52 flex gap-6">
                                      {item.is_billable === 0 ? (
                                        <Typography>{`${item.hours} `}</Typography>
                                      ) : (
                                        "-"
                                      )}

                                      <Typography
                                        className={`${
                                          user.billableHours == null &&
                                          user.nonBillableHours == null
                                            ? "hidden"
                                            : "absolute right-24 bottom-3    "
                                        }`}
                                      >
                                        <ItemMenu
                                          key={item.hourId}
                                          items={item}
                                          isAdmin={
                                            session?.data?.user?.admin ===
                                            "true"
                                          }
                                          onNotesClick={notesHandler}
                                          onEditClick={editModalhandleOpen}
                                          onDeleteClick={handleHoursDelete}
                                        />
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                ))}
                                <TableRow className="bg-[#EEEEEE]">
                                  <TableCell></TableCell>
                                  <TableCell></TableCell>
                                  <TableCell></TableCell>
                                  <TableCell></TableCell>
                                  <TableCell>
                                    <b>{totalBillableHoursItem}</b>
                                  </TableCell>
                                  <TableCell>
                                    <b>{totalNonBillableHoursItem}</b>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </AccordionDetails>
                      </div>
                    );
                  })}
                </Accordion>
              );
            })}
          </div>
        </>
      ) : (
        <DataNotFound />
      )}

      <HoursEditModal
        Open={editOpenModal}
        HandleModalClose={HandleEditModalClose}
        editId={editId}
        setEditOpenModal={setEditOpenModal}
        editOpenModal={editOpenModal}
        getAllData={getAllData}
        filters={filters}
      />
      <DeleteModal
        onDelete={onDelete}
        deleteMessage="Are you sure you want to delete this hours?"
        deleteOpenModal={deleteOpenModal}
        deleteHandleModalClose={deleteHandleModalClose}
      />
    </>
  );
}
