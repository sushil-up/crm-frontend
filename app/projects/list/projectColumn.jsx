import { Button } from "@mui/material";
import Link from "next/link";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import moment from "moment";
export const projectColumn = (
  currentUser,
  adminUser,
  handleProjectDelete,
  session
) => [
  {
    accessorkey: "id",
    header: "Id",
    cell: (row) => row?.id,
  },
  {
    accessorkey: "title",
    header: "Title",
    cell: (row) => (
      <Link
        className="!text-red-700 hover:underline"
        href={{
          pathname: `/projects/list/${row.id}/dashboard`,
        }}
      >
        {row?.title}
      </Link>
    ),
  },
  {
    accessorkey: "client",
    header: "Client",
    cell: (row) => row?.client,
  },
  {
    accessorkey: "createdBy",
    header: "Created By",
    cell: (row) => row?.createdBy,
  },
  {
    accessorkey: "pmName",
    header: "Assign",
    cell: (row) => row?.pmName,
  },
  {
    accessorkey: "status",
    header: "Status",
    cell: (row) => (
      <Button
        className={`${
          row?.status === "active"
            ? "!bg-green-700 !text-white !hover:bg-green-500 !rounded-3xl !capitalize !font-semibold !py-1 !px-3"
            : row?.status === "hold"
            ? "!bg-red-700 !text-white !hover:bg-red-500 !rounded-3xl !capitalize !font-semibold !py-1 !px-3"
            : "!bg-blue-700 !text-white !hover:bg-blue-500 !rounded-3xl !capitalize !font-semibold !py-1 !px-3"
        }`}
      >
        {row?.status}
      </Button>
    ),
  },
  {
    accessorkey: "start_date",
    header: " Start Date",
    cell: (row) => 
      moment(row?.start_date).format("YYYY-MM-DD") ,
  },
  {
    accessorkey: "Action",
    header: "Action",
    cell: (row) => {
      return (
        <>
          {adminUser == "true" && (
            <>
              <Button
                className="!text-red-700	!bg-red-100 !m-2 !hover:bg-red-200"
                sx={{ minWidth: "30px" }}
                onClick={() => handleProjectDelete(row.id)}
              >
                <DeleteOutlineIcon className="!w-4 !h-4" />
              </Button>
            </>
          )}
        </>
      );
    },
  },
];
