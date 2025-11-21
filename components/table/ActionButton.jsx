"use client";

import { Badge, Button, Menu, MenuItem, Tooltip } from "@mui/material";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const ActionButton = ({
  project,
  adminUser,
  currentUser,
  handleHoursDelete,
  notesHandler,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

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
        alt="Actions"
      />

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          onMouseLeave: handleClose,
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
              display: "flex",
              flexDirection: "row",
              padding: 0,
            },
          },
        }}
      >
        <div className="flex gap-2 px-2 py-1">
          {adminUser == "true" ? (
            <>
              <MenuItem>
                <Button
                  className="!text-red-700 !bg-red-100 !hover:bg-red-200"
                  sx={{ minWidth: "30px" }}
                  onClick={() => {
                    handleHoursDelete(project.id);
                    handleClose();
                  }}
                >
                  <DeleteOutlineIcon className="!w-4 !h-4" />
                </Button>
              </MenuItem>
            </>
          ) : (
            <>
              {currentUser == project?.user_id && (
                <MenuItem>
                  <Button
                    className="!text-red-700 !bg-red-100 !hover:bg-red-200"
                    sx={{ minWidth: "30px" }}
                    onClick={() => {
                      handleHoursDelete(project.id);
                      handleClose();
                    }}
                  >
                    <DeleteOutlineIcon className="!w-4 !h-4" />
                  </Button>
                </MenuItem>
              )}
            </>
          )}

          <MenuItem>
            <Button
              className="!text-green-700 !bg-green-200 !hover:bg-green-300"
              sx={{ minWidth: "30px" }}
              onClick={() => {
                router.push(`/hourlogs/list/${project.id}`);
                handleClose();
              }}
            >
              <EditOutlinedIcon className="!w-4 !h-3.5" />
            </Button>
          </MenuItem>

          <MenuItem>
            <Button
              className="!text-[#7971E4] !bg-[#D4D8FF] !cursor-pointer !hover:bg-violet-300"
              onClick={() => {
                notesHandler(project.id);
                handleClose();
              }}
              sx={{ minWidth: "30px" }}
            >
              <Badge
                badgeContent={project.notesCount || 0}
                color="error"
                className="!static"
              >
                <CommentOutlinedIcon className="!w-4 !h-3.5" />
              </Badge>
            </Button>
          </MenuItem>
        </div>
      </Menu>
    </div>
  );
};
