import { Badge, Button, Menu, MenuItem, Tooltip } from "@mui/material";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useState } from "react";
export const ItemMenu = ({
  items,
  isAdmin,
  onNotesClick,
  onEditClick,
  onDeleteClick,
  session,
  user,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const users = user?.name || items?.userName;
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <img
        src="/assets/images/dot-popup.png"
        className="cursor-pointer"
        onClick={handleOpen}
      />

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          onMouseLeave: handleClose,
          sx: {
            display: "flex",
            flexDirection: "row",
            boxShadow: "none",
            padding: "0px",
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        PaperProps={{
          sx: {
            backgroundColor: "white",
            borderRadius: 1,
            boxShadow: "0px 0px 8px 8px #eeeeee",
            "& .MuiMenu-list": {
              backgroundColor: "white",
              display: "flex",
            },
          },
        }}
      >
        <MenuItem>
          <Badge badgeContent={items.notesCount} color="error">
            <Tooltip title="Notes">
              <Button
                onClick={() => {
                  onNotesClick(items.hourId, users);
                  handleClose();
                }}
                className="!text-[#7971E4] !bg-[#D4D8FF] !cursor-pointer !hover:bg-violet-300"
                sx={{ minWidth: "30px" }}
              >
                <CommentOutlinedIcon className="!w-4 !h-3.5" />
              </Button>
            </Tooltip>
          </Badge>
        </MenuItem>

        {user?.id == session?.data?.user?.id ||
        items?.userName == session?.data?.user?.fullName ? (
          <MenuItem className="!p-[10px]">
            <Tooltip title="Edit">
              <Button
                onClick={() => {
                  onEditClick(items.hourId);
                  handleClose();
                }}
                className="!text-green-700 !bg-green-200 !hover:bg-green-300"
                sx={{ minWidth: "30px" }}
              >
                <EditOutlinedIcon className="!w-4 !h-3.5" />
              </Button>
            </Tooltip>
          </MenuItem>
        ) : (
          <>
            {isAdmin && (
              <MenuItem className="!p-[10px]">
                <Tooltip title="Edit">
                  <Button
                    onClick={() => {
                      onEditClick(items.hourId);
                      handleClose();
                    }}
                    className="!text-green-700 !bg-green-200 !hover:bg-green-300"
                    sx={{ minWidth: "30px" }}
                  >
                    <EditOutlinedIcon className="!w-4 !h-3.5" />
                  </Button>
                </Tooltip>
              </MenuItem>
            )}
          </>
        )}

        {isAdmin && (
          <MenuItem>
            <Tooltip title="Delete">
              <Button
                className="!text-red-700 !bg-red-100 !hover:bg-red-200"
                sx={{ minWidth: "30px" }}
                onClick={() => {
                  onDeleteClick(items.hourId);
                  handleClose();
                }}
              >
                <DeleteOutlineIcon className="!w-4 !h-4" />
              </Button>
            </Tooltip>
          </MenuItem>
        )}
      </Menu>
    </div>
  );
};
