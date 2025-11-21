import { Badge, Button, Tooltip, Typography } from "@mui/material";
import Link from "next/link";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";

export const hoursColumns = [
  { field: "id", headerName: "ID", width: 100 },
  {
    field: "projectName",
    headerName: " Project Title",
    width: 300,
    renderCell: (params) => (
      <Tooltip
        arrow
        placement="top-start"
        title={<span>{params.row.projectName}</span>}
      >
        <span>{`${params.row.projectName.slice(0, 30)}`}</span>
      </Tooltip>
    ),
  },
  { field: "taskName", headerName: " Task Title", width: 300 },
  { field: "description", headerName: " Description", width: 400 },
  { field: "hours", headerName: "Hours", width: 100 },
  { field: "date", headerName: " Date", width: 100 },
  {
    field: "",
    headerName: "Action ",
    width: 300,
    renderCell: (params) => (
      <>
        <Link href={`/hourlogs/list/${params.row.id}`}>
          <Button
            className="!text-green-700 !bg-green-200 !hover:bg-green-300"
            sx={{ minWidth: "30px" }}
          >
            <EditOutlinedIcon className="!w-4 h-4" />
          </Button>
        </Link>
        <Button
          className="!text-red-700 !bg-red-100 mx-2 !hover:bg-red-200  "
          sx={{ minWidth: "30px" }}
          onClick={() => handleHoursDelete(params.row.id)}
        >
          <DeleteOutlineIcon className="!w-4 !h-4" />
        </Button>
        <Button>
          <Typography className="" onClick={() => notesHandler(params.row.id)}>
            <Badge badgeContent={params.row.notesCount} color="error">
              <CommentOutlinedIcon className=" text-zinc-400 cursor-pointer " />
            </Badge>
          </Typography>
        </Button>
      </>
    ),
  },
];
