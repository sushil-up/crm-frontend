import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import DescriptionIcon from "@mui/icons-material/Description";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import React, { useEffect, useState } from "react";
import moment from "moment";
import DeleteModal from "@/models/DeleteModal";
import HourLogsService from "@/services/hourlogservice";
import { useSession } from "next-auth/react";
import HoursEditModal from "@/models/HoursEditModal";
import { ItemMenu } from "../../by-user/table/ItemMenu";
import { errorMsg, successMsg } from "@/app/toster-msg/msg";

export default function DailyReportingTable({
  hasScrolled,
  hoursData,
  descriptionHandler,
  notesHandler,
  getAllData,
  setLoading,
  getProjectData,
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

  const [deleteOpenModal, setDeleteOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editOpenModal, setEditOpenModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  useEffect(() => {
    if (hoursData?.length) {
      const initialExpanded = {};
      hoursData.forEach((_, index) => {
        initialExpanded[index] = true;
      });
      setExpandedRows(initialExpanded);
    }
  }, [hoursData]);

  const toggleRow = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Function for delete functionality
  const onDelete = async () => {
    try {
      const result = await HourLogsService.deleteHoursById(deleteId);
      deleteHandleModalClose();
      successMsg(result.message);
      setLoading(false);
      getProjectData();
      getAllData(filters);
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
      {hoursData?.length ? (
        <>
          <TableContainer component={Paper} className="table-outer">
            <Table
              sx={{ minWidth: 650 }}
              aria-label="simple table"
              className="table-fixed"
            >
              {/* <div className={` ${hasScrolled ? "fixed-header" : ""}`}> */}
              <TableHead
                className={`!bg-[#231f20] ${
                  hasScrolled ? "sticky-header " : ""
                }`}
              >
                <TableRow>
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
              {/* </div> */}
              {hoursData.map((users, index) => (
                <>
                  <TableBody key={index}>
                    <TableRow key={index} className="!bg-[#FFE3E4] !mt-3">
                      <TableCell className="capitalize">
                        {moment(users.date).format("MMM D, YYYY")}
                      </TableCell>
                      <TableCell className="capitalize">
                        {(() => {
                          let totalAbsent = 0;
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
                      </TableCell>
                      <TableCell className="capitalize">
                        Total Hours : <b>{users.totalHours}</b>
                      </TableCell>
                      <TableCell className="capitalize">
                        T.L Hours : <b>{users?.hoursByTL}</b>
                      </TableCell>
                      <TableCell className="capitalize">
                        Billable : <b>{users?.billableHours}</b>
                      </TableCell>
                      <TableCell className="capitalize">
                        Non Billable : <b>{users?.nonBillableHours}</b>
                      </TableCell>
                      <TableCell className="capitalize">
                        {expandedRows[index] ? (
                          <KeyboardArrowUpOutlinedIcon
                            className="cursor-pointer"
                            onClick={() => toggleRow(index)}
                          />
                        ) : (
                          <KeyboardArrowDownOutlinedIcon
                            className="cursor-pointer"
                            onClick={() => toggleRow(index)}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                  {expandedRows[index] && (
                    <>
                      {users.projects?.map((user) => {
                        const totalBillableHoursItem = calculateTotalHours(
                          user.projectTasks,
                          1
                        );
                        const totalNonBillableHoursItem = calculateTotalHours(
                          user.projectTasks,
                          0
                        );
                        return (
                          <>
                            {/* <TableContainer> */}
                            <Table
                              // sx={{ minWidth: 1596 }}
                              // aria-label="simple table"
                              className="!contents"
                            >
                              <TableHead className="!bg-[#514e4f]  ">
                                <TableRow className="">
                                  <TableCell className="!font-semibold !text-white !border-slate-800 ">
                                    <b>{user.title}</b>
                                  </TableCell>

                                  <TableCell className="!font-semibold !text-white !border-slate-800 ">
                                    <b>
                                      {moment(users.date).format("MMM Do")}{" "}
                                    </b>
                                    <b>{user.totalHours}</b>
                                  </TableCell>
                                  <TableCell className="!font-semibold !text-white !border-slate-800 ">
                                    Total Hours : <b>{user.totalHours}</b>
                                  </TableCell>
                                  <TableCell className="!font-semibold !text-white !border-slate-800 ">
                                    T.L Hours : <b>{user?.hoursByTL}</b>
                                  </TableCell>
                                  <TableCell className="!font-semibold !text-white !border-slate-800 ">
                                    Billable : <b>{user?.billableHours}</b>
                                  </TableCell>
                                  <TableCell className="!font-semibold !text-white !border-slate-800 ">
                                    Non Billable :{" "}
                                    <b>{user?.nonBillableHours}</b>
                                  </TableCell>
                                  <TableCell className="!font-semibold !text-white !border-slate-800 ">
                                    Action :
                                  </TableCell>
                                </TableRow>
                              </TableHead>
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

                                    <TableCell className=" w-52  ">
                                      {item.is_billable === 0 ? (
                                        <p>{`${item.hours} `}</p>
                                      ) : (
                                        "-"
                                      )}

                                      <p
                                        className={`${
                                          user.billableHours == null &&
                                          user.nonBillableHours == null
                                            ? "hidden"
                                            : "absolute right-24 bottom-3    "
                                        }`}
                                      ></p>
                                    </TableCell>
                                    <TableCell>
                                      <ItemMenu
                                        key={item.hourId}
                                        items={item}
                                        isAdmin={
                                          session?.data?.user?.admin == "true"
                                        }
                                        onNotesClick={notesHandler}
                                        onEditClick={editModalhandleOpen}
                                        onDeleteClick={handleHoursDelete}
                                        session={session}
                                      />
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
                                  <TableCell></TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                            {/* </TableContainer> */}
                          </>
                        );
                      })}
                    </>
                  )}
                </>
              ))}
            </Table>
          </TableContainer>
        </>
      ) : (
        <>
          <Table
            sx={{ minWidth: 650 }}
            aria-label="simple table"
            className="table-fixed"
          >
            <TableHead className="!bg-[#231f20]">
              <TableRow>
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
            <TableRow>
              <TableCell colSpan={7} align="center">
                No data available
              </TableCell>
            </TableRow>
          </Table>
        </>
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
