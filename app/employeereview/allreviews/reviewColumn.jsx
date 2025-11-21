import {
  Box,
  Button,
  CircularProgress,
  Tooltip,
  Typography,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export const reviewColumn = (
  descriptionHandler,
  currentUser,
  adminUser,
  handleEdit,
  handleClickOpen,
  feedbackHandler
) => [
  {
    accessorKey: "id",
    header: "ID",
    cell: (row ) => row?.id || "-",
    
  },
  {
    accessorKey: "userName",
    header: "Employee",
    cell: (row ) => row?.userName || "-",
  },
  {
    accessorKey: "projectName",
    header: "Project",
    cell: (row ) => row?.projectName || "-",
  },
  {
    accessorKey: "feedback",
    header: "Feedback",
    cell: ( row ) => {
      const user = row;
      const text = user?.feedback || "";
      return (
        <span
          onClick={() =>
            descriptionHandler(
              text,
              user.createdAt,
              user.nonBillableReason,
              user.is_billable
            )
          }
          style={{ cursor: "pointer" }}
        >
          {text.length > 20 ? `${text.slice(0, 26)}...` : text || "-"}
        </span>
      );
    },
  },
  {
    accessorKey: "average",
    header: "Overall Performance",
    cell: ( row ) => {
      const average = row?.average;
  
      if (average === undefined || average === null) {
        return "-"; // Or return a loading spinner or empty state
      }
  
      const progressColor =
        average < 5 ? "#f44336" : average < 8 ? "#ff9800" : "#4caf50";
  
      return (
        <Box position="relative" display="inline-flex">
          <CircularProgress
            variant="determinate"
            value={(average / 10) * 100}
            sx={{ color: progressColor }}
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
            <Typography variant="caption" component="div" color="textSecondary">
              {average.toFixed(1)}
            </Typography>
          </Box>
        </Box>
      );
    },
  },
  
  {
    accessorKey: "productivity_feedback",
    header: "Overall Feedback",
    cell: ( row ) => {
      const user = row;
      const text = user?.productivity_feedback || "";
      return (
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
          style={{ cursor: "pointer" }}
        >
          {text.length > 10 ? `${text.slice(0, 10)}...` : text || "-"}
        </span>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Action",
    cell: ( row ) => {
      const user = row;
      const isOwner = user?.id === currentUser;
      const isAdmin = adminUser === "true";

      return (
        <>
          {isAdmin || isOwner ? (
            <>
              <Tooltip title="Edit">
                <Button
                  sx={{
                    minWidth: "30px",
                    color: "#388e3c",
                    backgroundColor: "#c8e6c9",
                    "&:hover": { backgroundColor: "#a5d6a7" },
                  }}
                  onClick={() => handleEdit(user.id)}
                >
                  <EditOutlinedIcon fontSize="small" />
                </Button>
              </Tooltip>
              <Tooltip title="Delete">
                <Button
                  sx={{
                    minWidth: "30px",
                    color: "#d32f2f",
                    backgroundColor: "#ffcdd2",
                    ml: 1,
                    "&:hover": { backgroundColor: "#ef9a9a" },
                  }}
                  onClick={() => handleClickOpen(user.id)}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </Button>
              </Tooltip>
            </>
          ) : (
            <>
              <Tooltip title="You are not authorized to edit">
                <Button
                  sx={{
                    minWidth: "30px",
                    color: "#9e9e9e",
                    backgroundColor: "#e0e0e0",
                    cursor: "not-allowed",
                  }}
                  disabled
                >
                  <EditOutlinedIcon fontSize="small" />
                </Button>
              </Tooltip>
              <Tooltip title="You are not authorized to delete">
                <Button
                  sx={{
                    minWidth: "30px",
                    color: "#9e9e9e",
                    backgroundColor: "#e0e0e0",
                    ml: 1,
                    cursor: "not-allowed",
                  }}
                  disabled
                >
                  <DeleteOutlineIcon fontSize="small" />
                </Button>
              </Tooltip>
            </>
          )}
        </>
      );
    },
  },
];
