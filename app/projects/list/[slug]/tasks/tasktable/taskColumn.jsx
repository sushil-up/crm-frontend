import { Button, Tooltip } from "@mui/material";
import Link from "next/link";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment";
export const taskColumn = (descriptionHandler, handleClickDelete) => [
  {
    accessorkey: "id",
    header: "Id",
    cell: (row) => row?.id,
  },
  {
    accessorkey: "title",
    header: "Title",
    cell: (row) => (
      <Tooltip arrow placement="top-start" title={<span>{row?.title}</span>}>
        <span>{`${row?.title.slice(0, 30)}`}</span>
      </Tooltip>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ( row ) => {
      const description = row?.description || "-";
      const isLong = description.length > 35;
      const truncated = description.slice(0, 35);
      return isLong ? (
        <span
          className="text-sm capitalize min-w-0 cursor-pointer"
          onClick={() => descriptionHandler(description)}
        >
          <div dangerouslySetInnerHTML={{ __html: `${truncated}...` }} />
        </span>
      ) : (
        <div
          dangerouslySetInnerHTML={{ __html: description }}
          className="text-sm capitalize"
        />
      );
    },
  },

  {
    accessorkey: "status",
    header: "Status",
    cell: (row) => row?.status,
  },
  {
    accessorkey: "start_date",
    header: " Start Date",
    cell: (row) => moment(row?.start_date).format("YYYY-MM-DD"),
  },
  {
    accessorkey: "end_date",
    header: "End Date",
    cell: (row) => moment(row?.end_date).format("YYYY-MM-DD"),
  },
  {
    accessorkey: "Action",
    header: "Action",
    cell: (row) => {
      return (
        <>
       <div className="flex gap-3">
       <Link href={`/projects/list/144/tasks/update/${row.id}`}>
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
            onClick={() => handleClickDelete(row.id)}
          >
            <DeleteOutlineIcon className="w-4 h-4" />
          </Button>
       </div>
        </>
      );
    },
  },
];
