import React, { useEffect, useRef, useState } from "react";
import { Button, Tooltip, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import NotesService from "@/services/notesservice";
import { useSession } from "next-auth/react";
import { errorMsg, successMsg } from "@/app/toster-msg/msg";
import DeleteModal from "@/models/DeleteModal";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from "@mui/lab/TimelineOppositeContent";
import Loading from "@/app/users/loading";
import NotesForm from "@/components/forms/notes/NotesForm";
import { NotesValidationSchema } from "@/components/validation/notes-validation/NotesValidationSchema";

export default function NotestInput({ hoursId, updateNotesCount, userName }) {
  const [deleteOpenModal, setDeleteOpenModal] = useState(false);
  const [notesData, setNotesData] = useState([]);
  const [notesEdit, setNotesEdit] = useState(null);
  const [notesDelete, setNotesDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const session = useSession();
  const userId = session.data.user.id;
  const adminUser = session?.data?.user?.admin;

  //for scroll header
  const chatContainerRef = useRef(null);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(NotesValidationSchema),
    defaultValues: {
      description: "", // Empty description for the default add form
    },
  });

  const notesEditHandler = async (id) => {
    try {
      const result = await NotesService.getNotesById(id);
      setNotesEdit(result.data);
      reset(result.data);
    } catch (error) {
      errorMsg(error?.message);
    }
  };
  // async function getSlackUsers() {
  //   try {
  //     const res = await fetch("/api/slackUsers");
  //     if (!res.ok) throw new Error("Failed to fetch Slack users");
  //     const slackUsers = await res.json();
  //     const filteredUser  = slackUsers.filter(
  //       (user) => user?.deleted === false && user?.profile?.real_name === userName
  //     );
      
  //     console.log("filteredUserfilteredUserfilteredUser", filteredUser);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  // useEffect(() => {
  //   getSlackUsers();
  // }, []);

  const onSubmit = async (data) => {
    try {
      if (notesEdit) {
        // Update notes if notesEdit is not null
        const result = await NotesService.updateNotes(notesEdit.id, data);
        successMsg(result.message);
        getAllNotes();
        reset({
          description: "",
        });
      } else {
        // Add new notes if notesEdit is null
        const notes = {
          hourLog_id: hoursId,
          user_id: userId,
          description: data.description,
          user_tag: "knli",
        };
        const result = await NotesService.addNotes(notes);
        const response = await fetch("/api/sendSlackNotification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ noteContent: notes, userName: userName }),
        });

        const resultData = await response.json();
        successMsg(result.message);
        getAllNotes();
        reset({
          description: "",
        });
        //FOR refresh all data for add delete notes

        updateNotesCount("add", hoursId);
      }
    } catch (error) {
      errorMsg(error?.message);
    }
    setNotesEdit(null); // Reset notesEdit after submission
  };

  const getAllNotes = async () => {
    try {
      const result = await NotesService.getAllNotes(hoursId);
      if (result.status == true) {
        setLoading(false);
        if (result.data && result.data.notes) {
          setNotesData(result.data.notes);
        } else {
          setNotesData([]);
        }
      }
    } catch (error) {
      errorMsg(error?.message);
    }
  };

  useEffect(() => {
    getAllNotes();
  }, [notesDelete]);

  //for scroll header
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [notesData]);

  const handleNotesDelete = (id) => {
    setNotesDelete({ id }); // Set notesEdit to the ID of the note to be deleted
    setDeleteOpenModal(true); // Open modal
  };

  const onDelete = async (id) => {
    try {
      const result = await NotesService.deleteNotes(id);
      setDeleteOpenModal(false); // Close modal on successful deletion
      successMsg(result.message);

      // Refresh notes after deletion directly
      await getAllNotes();
      updateNotesCount("delete", hoursId);
    } catch (error) {
      errorMsg(error?.message);
    }
  };

  // for delete
  const deleteHandleModalClose = () => {
    setDeleteOpenModal(false); // Close modal
  };

  return (
    <div>
      {loading && <Loading />}
      <div className=" h-56 overflow-auto  " ref={chatContainerRef}>
        {notesData.length > 0 ? (
          notesData.map((item) => (
            <div className=" flex gap-9" key={item.id}>
              <Timeline
                sx={{
                  [`& .${timelineOppositeContentClasses.root}`]: {
                    flex: 0.2,
                  },
                }}
                className=""
              >
                <TimelineItem>
                  <TimelineOppositeContent color="textSecondary ">
                    {item.date}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <b className="capitalize">{item.userName.full_name}</b>
                    &nbsp;&nbsp;
                    {/* Delete button */}
                    {adminUser == "true" ? (
                      <>
                        <Button
                          onClick={() => {
                            notesEditHandler(item.id);
                          }}
                          className="!text-green-700 !hover:bg-green-300 p-0 m-0"
                          sx={{ minWidth: "30px" }}
                        >
                          <EditOutlinedIcon className="!w-4 !h-4" />
                        </Button>
                        <Button
                          onClick={() => handleNotesDelete(item.id)} // Trigger delete action
                          className="!text-red-700  !hover:bg-red-200 p-0 m-0 "
                          sx={{ minWidth: "30px" }}
                        >
                          <DeleteOutlineIcon className="!w-4 !h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Tooltip
                          arrow
                          placement="top-start"
                          title="You are not authorized to edit"
                        >
                          <Button
                            className="!text-green-700 !hover:bg-green-300 p-0 m-0 !cursor-not-allowed"
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
                            className="!text-red-700  !hover:bg-red-200 p-0 m-0 !cursor-not-allowed"
                            sx={{ minWidth: "30px" }}
                          >
                            <DeleteOutlineIcon className="!w-4 !h-4" />
                          </Button>
                        </Tooltip>
                      </>
                    )}
                    <br />
                    {item.description}
                  </TimelineContent>
                </TimelineItem>
              </Timeline>
            </div>
          ))
        ) : (
          <Typography></Typography>
        )}
      </div>

      {/* Displaying the form for editing or adding notes */}
      <form onSubmit={handleSubmit(onSubmit)} className="">
        <NotesForm notesEdit={notesEdit} control={control} errors={errors} />
      </form>

      {/* Displaying the delete modal */}
      <DeleteModal
        onDelete={() => onDelete(notesDelete?.id)} // Trigger onDelete with the note ID
        deleteMessage="Are you sure you want to delete this note?"
        deleteOpenModal={deleteOpenModal}
        deleteHandleModalClose={deleteHandleModalClose}
      />
    </div>
  );
}
