import { Button, Tooltip } from "@mui/material";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
export const userColumn = (
  currentUser,
  adminUser,
  handleClickOpen,
  checkAdminHandler,
  session
) => [
  {
    accessorkey: "id",
    header: "Id",
    cell: (row) => row?.id,
  },
  {
    accessorkey: "full_name",
    header: "Full Name",
    cell: (row) => (
      <Link
        className="!text-red-700 hover:underline"
        href={{
          pathname: `/users/list/${row.id}/dashboard`,
        }}
      >
        {row?.full_name}
      </Link>
    ),
  },
  {
    accessorkey: "email",
    header: "Email",
    cell: (row) => (
      <>
      <div>
      <Tooltip arrow placement="top-start" title={<span>{row.email}</span>}>
        <span>{`${row.email?.slice(0, 20)}`}</span>
      </Tooltip>
      </div>
      </>
    ),
  },
  {
    accessorkey: "phone",
    header: "Phone No",
    cell: (row) => row?.phone,
  },
  {
    accessorkey: "profile_image",
    header: "Profile Image",
    cell: (row) => <img src={row?.profile_image} style={{ width: "50px" }} />,
  },
  {
    accessorkey: "status",
    header: "Status",
    cell: (row) => <div className="!p-4 capitalize">{row?.status}</div>,
  },
  {
    accessorkey: "is_admin",
    header: "Is Admin",
    cell: (row) => {
      const isCurrentUser = row.id === currentUser;
      const isAdmin = row.is_admin === "true";
      if (adminUser !== "true") return null;
      return isCurrentUser ? (
        <Tooltip
          title="You cannot change your own role"
          arrow
          placement="top-start"
        >
          <TaskAltOutlinedIcon className="!cursor-not-allowed" />
        </Tooltip>
      ) : isAdmin ? (
        <Tooltip title="Remove Admin" arrow placement="top-start">
          <CheckIcon
            className="cursor-pointer"
            onClick={() => checkAdminHandler(row.id, "remove")}
          />
        </Tooltip>
      ) : (
        <Tooltip title="Make Admin" arrow placement="top-start">
          <CloseIcon
            className="cursor-pointer"
            onClick={() => checkAdminHandler(row.id, "add")}
          />
        </Tooltip>
      );
    },
  },
  {
    accessorkey: "Action",
    header: "Action",
    cell: (row) => {
      return (
        <>
          {adminUser == "true" || row.id === currentUser ? (
            <>
              <Link href={`/users/list/${row.id}`}>
                <Button
                  className="!text-green-700 !bg-green-200 hover:!bg-green-300 "
                  sx={{ minWidth: "30px" }}
                >
                  <EditOutlinedIcon className="!w-4 !h-4" />
                </Button>
              </Link>
              {session && session?.user?.admin == "true" && (
                <Button
                  className="!text-red-700	!bg-red-100 !m-2 hover:!bg-red-200"
                  sx={{ minWidth: "30px" }}
                  onClick={() => handleClickOpen(row.id)}
                >
                  <DeleteOutlineIcon className="!w-4 !h-4  " />
                </Button>
              )}
            </>
          ) : (
            <>
              <Tooltip
                arrow
                placement="top-start"
                title="You are not authorized to edit"
              >
                <Button
                  className="!text-green-700 !bg-green-200 hover:!bg-green-300 cursor-not-allowed "
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
        </>
      );
    },
  },
];
