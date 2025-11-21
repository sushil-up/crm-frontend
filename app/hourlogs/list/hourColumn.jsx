import { Tooltip } from "@mui/material";
import moment from "moment";
import { ActionButton } from "@/components/table/ActionButton";
import DescriptionIcon from "@mui/icons-material/Description";
export const hourColumn = (
  descriptionHandler,
  currentUser,
  adminUser,
  handleHoursDelete,
  notesHandler,
) => [
  {
    accessorkey: "id",
    header: "Id",
    cell: (row) => row?.id,
  },
  {
    accessorkey: "projectName",
    header: "Project Title",
    cell: (row) => (
      <Tooltip
        arrow
        placement="top-start"
        title={<span>{row.projectName}</span>}
      >
        <span>{`${row.projectName?.slice(0, 30)}`}</span>
      </Tooltip>
    ),
  },
  {
    accessorkey: "taskName",
    header: "Task Title",
    cell: (row) => (
      <Tooltip arrow placement="top-start" title={<span>{row.taskName}</span>}>
        <span>{`${row.taskName?.slice(0, 30)}`}</span>
      </Tooltip>
    ),
  },
  {
    accessorkey: "userName",
    header: "Employee Name",
    cell: (row) => row.userName,
  },
  {
    accessorkey: "description",
    header: "Description",
    cell: (row) => {
      {
        row?.description?.length ? (
          <DescriptionIcon
            className=" text-zinc-400 cursor-pointer "
            onClick={() =>
              descriptionHandler(
                row?.description,
                row?.createdAt,
                row?.nonBillableReason
              )
            }
          />
        ) : (
          "-"
        );
      }
    },
  },
  {
    accessorkey: "hoursByTL",
    header: "Hours By T.L",
    cell: (row) => row.hoursByTL,
  },
  {
    accessorkey: "hours",
    header: "Hours",
    cell: (row) => row.hours,
  },
  {
    accessorkey: "status",
    header: "Date",
    cell: (row) => moment(row.date).format("YYYY-MM-DD"),
  },
  {
    accessorkey: "Action",
    header: "Action",
    cell: (row) => {
      return (
        <>
          <ActionButton
            project={row}
            currentUser={currentUser}
            adminUser={adminUser}
            handleHoursDelete={handleHoursDelete}
            notesHandler={notesHandler}
          />
        </>
      );
    },
  },
];
