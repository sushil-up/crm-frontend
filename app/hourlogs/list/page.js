"use client";
import React, { useState, useEffect, useContext } from "react";
import { Card, Typography } from "@mui/material";
import Loading from "@/app/users/loading";
import { errorMsg, successMsg } from "@/app/toster-msg/msg";
import HourLogsService from "@/services/hourlogservice";
import LayoutHeader from "@/app/layoutHeader";
import { Box } from "@mui/material";
import { Button } from "@mui/material";
import useDocumentTitle from "../../utils/useDocumentTitle";
import HoursFilter from "../hoursFilter/HoursFilter";
import { useForm } from "react-hook-form";
import moment, * as moments from "moment";
import { useRouter, useSearchParams } from "next/navigation";
import DeleteModal from "@/models/DeleteModal";
import NotesModal from "@/models/NotesModal";
import DescriptionModal from "@/models/DescriptionModal";
import { useSession } from "next-auth/react";
import CommonTable from "@/components/CommonTable";
import { hourColumn } from "./hourColumn";
import UserContext from "@/context/UserContext";

// To getting all hourlogs
function AllHours() {
  const [hoursData, setHoursData] = useState([]);
  const [hoursId, setHoursId] = useState();
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState();
  const [totalRows, setTotalRows] = useState(1);
  const [controller, setController] = useState({
    page: 0,
    rowsPerPage: 25,
  });
  const [projectName, setProjectName] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  // current month date get with moment
  const startDefaultDate = moment().subtract(1, "years").format("YYYY-MM-DD");
  const endDefaultDate = moment().format("YYYY-MM-DD");
  //for get query param from url
  const searchParams = useSearchParams();
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const projectQuery = searchParams.get("projectId");
  const startDateQuery = searchParams.get("startDate");
  const ebdDateQuery = searchParams.get("endDate");
  const [filters, setFilters] = useState({
    projectId: projectQuery ? projectQuery : "",
    startDate: startDateQuery ? startDateQuery : startDefaultDate,
    endDate: ebdDateQuery ? ebdDateQuery : endDefaultDate,
  });
  const session = useSession();
  const currentUser = session?.data?.user?.id;
  const adminUser = session?.data?.user?.admin;
  const getProjectData = async () => {
    try {
      const projectData = await HourLogsService.getSelectProjects();
      setProjectName(projectData.data);
      const filteredProject = projectData.data.find(
        (item) => String(item.value) === String(projectQuery)
      );

      if (filteredProject) {
        setSelectedProject(filteredProject);
        setProjectId(filteredProject.id);

        // If your Select expects { value, label } format:
        setValue("project_id", {
          value: filteredProject.id,
          label: filteredProject.title,
        });

        setFilters((prev) => ({
          ...prev,
          projectId: filteredProject.id,
        }));
      } else {
        setSelectedProject("All");
        setValue("project_id", { value: "All", label: "All" });
        setFilters((prev) => ({
          ...prev,
          projectId: "All",
        }));
      }
    } catch (error) {
      errorMsg(error?.message);
    }
  };

  useEffect(() => {
    getProjectData(); // load project
  }, [projectQuery]);
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      startDate: "",
      endDate: "",
      project_id: "All",
    },
  });

  //PAGE TITLE
  useDocumentTitle("All Hours | Acewebx");
  //get all hours log data
  const getAllHoursData = async (page, pageSize, filters) => {
    setLoading(true);
    try {
      const result = await HourLogsService.getAllhoursBySlug(
        page,
        pageSize,
        filters
      );
      if (result.data.length === 0 && controller.page !== 0) {
        setController({
          ...controller,
          page: 0,
          rowsPerPage: 25,
        });
      }
      setHoursData(result.data.hourLogs);
      setTotalRows(result.data.totalCount);
      setLoading(false);
    } catch (error) {
      errorMsg(error?.message);
    }
  };
  useEffect(() => {
    getAllHoursData(controller.page, controller.rowsPerPage, filters);
  }, [controller]);

  const onSubmit = async (data) => {
    setLoading(true);
    setController({
      ...controller,
      page: 0,
      rowsPerPage: 25,
    });
    data.project_id = projectId; // Update state with form data
    let filterData = {
      projectId: data.project_id ? data.project_id : "",
      startDate: data.startDate,
      endDate: data.endDate,
    };
    const queryString = new URLSearchParams(filterData).toString();
    setFilters(filterData);
    setLoading(false);
    router.push(`/hourlogs/list?${queryString}`);
    getAllHoursData(controller.page, controller.rowsPerPage, filterData); // Fetch data using the updated filter
  };

  const handlepProjectIdChange = (data) => {
    setValue("project_id", data);
    setProjectId(data?.id);
  };

  const [readMoreModalOpen, setReadMoreModalOpen] = useState(false); // Modal open state
  const [descriptionVal, setDescriptionVal] = useState();
  const [dateTime, setDateTime] = useState();

  const descriptionHandleModalClose = () => {
    setReadMoreModalOpen(false);
  };

  const descriptionHandler = (description, createdAt, nonReason) => {
    setReadMoreModalOpen(true);
    setDescriptionVal(description);
    setDateTime(createdAt);
  };

  const [deleteOpenModal, setDeleteOpenModal] = useState(false); // Modal open state

  const [deleteId, setDeleteId] = useState(null); // Id to be deleted
  // Function for delete functionality
  const onDelete = async () => {
    try {
      const result = await HourLogsService.deleteHoursById(deleteId);
      deleteHandleModalClose();
      successMsg(result.message);
      setLoading(false);
      getAllHoursData(controller.page, controller.rowsPerPage, filters);
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

  // notes handler
  const notesHandler = (hourId) => {
    setHoursId(hourId);
    setNotesModalOpen(true);
  };

  const notesHandleModalClose = () => {
    setNotesModalOpen(false);
  };

  // for notes count update
  const updateNotesCount = (action, hourId) => {
    setHoursData((prevData) =>
      prevData.map((item) =>
        item.id === hourId
          ? {
              ...item,
              notesCount:
                action === "add" ? item.notesCount + 1 : item.notesCount - 1,
            }
          : item
      )
    );
  };
  // Pagination Handlers
  const handlePageChangePagination = (event, newPage) => {
    setController((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleChangeRowsPerPage = (event) => {
    setController({
      ...controller,
      page: 0,
      rowsPerPage: parseInt(event.target.value, 10),
    });
  };

  const defaultStartDate = startDateQuery;
  const defaultEndDate = ebdDateQuery;
const {setTitle} = useContext(UserContext);
  setTitle("All Hour Logs");
  return (
    <>
      {/* <Box className="flex mb-5 border border-[#FFD4D4] bg-white rounded-[5px] w-full p-4">
        <LayoutHeader pageTitle="All Hour Logs" />
        <Box
          className="ml-auto flex justify-end"
          sx={{
            width: 180,
          }}
        >
          <Button
            className=" add-page-hover-btn bg-theme-red !text-white !hover:bg-orange-900 !rounded-full !py-2 !px-4 "
            onClick={() => router.push(`/hourlogs/add`)}
          >
            Add Hour logs
          </Button>
        </Box>
      </Box> */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-5">
        <HoursFilter
          control={control}
          rhfSetValue={setValue}
          handleChange={handlepProjectIdChange}
          defaultStartDate={defaultStartDate}
          defaultEndDate={defaultEndDate}
          errors={errors}
        />
      </form>
      <Card className="bg-white !shadow-2xl">
        {loading && <Loading />}

        {hoursData?.length > 0 ? (
          <CommonTable
            data={hoursData}
            column={hourColumn(
              descriptionHandler,
              currentUser,
              adminUser,
              handleHoursDelete,
              notesHandler
            )}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            controller={controller}
            userCount={totalRows}
            handlePageChange={handlePageChangePagination}
          />
        ) : (
          <Typography className="text-red-600 text-center my-4">
            Data not found
          </Typography>
        )}
      </Card>

      <DeleteModal
        onDelete={onDelete}
        deleteMessage="Are you sure you want to delete this hours?"
        deleteOpenModal={deleteOpenModal}
        deleteHandleModalClose={deleteHandleModalClose}
      />
      <DescriptionModal
        descriptionMessage="Hours Description"
        descriptionHandleModalClose={descriptionHandleModalClose}
        readMoreModalOpen={readMoreModalOpen}
        descriptionVal={descriptionVal}
        dateTime={dateTime}
        // nonBillableReason={nonBillableReason}
        // isBillableReason={isBillableReason}
      />
      <NotesModal
        notesModalOpen={notesModalOpen}
        notesHandleModalClose={notesHandleModalClose}
        hoursId={hoursId}
        setNotesModalOpen={setNotesModalOpen}
        updateNotesCount={updateNotesCount}
      />
    </>
  );
}

export default AllHours;

// "use client";
// import React, { useState, useEffect } from "react";
// import { Badge, Card, Tooltip, Typography } from "@mui/material";
// import Loading from "@/app/users/loading";
// import { errorMsg, successMsg } from "@/app/toster-msg/msg";
// import HourLogsService from "@/services/hourlogservice";
// import LayoutHeader from "@/app/layoutHeader";
// import Link from "next/link";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
// import { Box } from "@mui/material";
// import { Button } from "@mui/material";
// import useDocumentTitle from "../../utils/useDocumentTitle";
// import HoursFilter from "../hoursFilter/HoursFilter";
// import { useForm } from "react-hook-form";
// import moment, * as moments from "moment";
// import { useRouter, useSearchParams } from "next/navigation";
// import DeleteModal from "@/models/DeleteModal";
// import NotesModal from "@/models/NotesModal";
// import DescriptionIcon from '@mui/icons-material/Description';
// import DescriptionModal from "@/models/DescriptionModal";
// import { useSession } from "next-auth/react";

// // To getting all hourlogs
// function AllHours() {
//   const [hoursData, setHoursData] = useState([]);
//   const [hoursId, setHoursId] = useState();
//   const [loading, setLoading] = useState(false);
//   const [projectId, setProjectId] = useState();
//   const [totalRows, setTotalRows] = useState(1);
//   const [pageSize, setPageSize] = useState(25);
//   const [page, setPage] = useState(0);
//   const [projectName, setProjectName] = useState([]);
//   const [selectedProject, setSelectedProject] = useState(null);
//   // current month date get with moment
//   const startDefaultDate = moment().subtract(1, "years").format("YYYY-MM-DD");
//   const endDefaultDate = moment().format("YYYY-MM-DD");
//   //for get query param from url
//   const searchParams = useSearchParams();
//   const [notesModalOpen, setNotesModalOpen] = useState(false);
//   const projectQuery = searchParams.get("projectId");
//   const startDateQuery = searchParams.get("startDate");
//   const ebdDateQuery = searchParams.get("endDate");
//   const [filters, setFilters] = useState({
//     projectId: projectQuery ? projectQuery : "",
//     startDate: startDateQuery ? startDateQuery : startDefaultDate,
//     endDate: ebdDateQuery ? ebdDateQuery : endDefaultDate,

//   });
//   const session = useSession();
//   const getProjectData = async () => {
//     try {
//       const projectData = await HourLogsService.getSelectProjects();
//       setProjectName(projectData.data);
//       const filteredProject = projectData.data.find(
//         (item) => String(item.value) === String(projectQuery)
//       );

//       if (filteredProject) {
//         setSelectedProject(filteredProject);
//         setProjectId(filteredProject.id);

//         // If your Select expects { value, label } format:
//         setValue("project_id", {
//           value: filteredProject.id,
//           label: filteredProject.title,
//         });

//         setFilters((prev) => ({
//           ...prev,
//           projectId: filteredProject.id,
//         }));
//       } else {
//         setSelectedProject("All");
//         setValue("project_id", { value: "All", label: "All" });
//         setFilters((prev) => ({
//           ...prev,
//           projectId: "All",
//         }));
//       }
//     } catch (error) {
//       errorMsg(error?.message);
//     }
//   };

//   useEffect(() => {
//     getProjectData(); // load project
//   }, [projectQuery]);
//   const router = useRouter();
//   const {
//     control,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       startDate: "",
//       endDate: "",
//       project_id: "All",

//     },
//   });

//   //PAGE TITLE
//   useDocumentTitle("All Hours | Acewebx");
//   //get all hours log data
//   const getAllHoursData = async (page, pageSize, filters) => {
//     setLoading(true);
//     try {
//       const result = await HourLogsService.getAllhoursBySlug(
//         page,
//         pageSize,
//         filters
//       );
//       setHoursData(result.data.hourLogs);
//       setTotalRows(result.data.totalCount);
//       setLoading(false);
//     } catch (error) {

//       errorMsg(error?.message);
//     }
//   };
//   useEffect(() => {
//     getAllHoursData(page, pageSize, filters);
//   }, [page, pageSize]);

//   const onSubmit = async (data) => {
//     setLoading(true);
//     data.project_id = projectId;  // Update state with form data
//     let filterData = {
//       projectId: data.project_id ? data.project_id : "",
//       startDate: data.startDate,
//       endDate: data.endDate,
//     };
//     const queryString = new URLSearchParams(filterData).toString();
//     setFilters(filterData);
//     setLoading(false);
//     router.push(`/hourlogs/list?${queryString}`);
//     getAllHoursData(page, pageSize, filterData);          // Fetch data using the updated filter
//   };

//   const handlepProjectIdChange = (data) => {
//     setValue("project_id", data);
//     setProjectId(data?.id);
//   };

//   const [readMoreModalOpen, setReadMoreModalOpen] = useState(false); // Modal open state
//   const [descriptionVal, setDescriptionVal] = useState();
//   const [dateTime, setDateTime] = useState();

//   const descriptionHandleModalClose = () => {
//     setReadMoreModalOpen(false);
//   };

//   const descriptionHandler = (description, createdAt, nonReason) => {
//     setReadMoreModalOpen(true);
//     setDescriptionVal(description);
//     setDateTime(createdAt);
//   };

//   const hoursColumns = [
//     { field: "id", headerName: "ID", width: 100 },
//     {
//       field: "projectName",
//       headerName: " Project Title",
//       width: 100,
//       renderCell: (params) => (
//         <Tooltip
//           arrow
//           placement="top-start"
//           title={<span>{params.row.projectName}</span>}
//         >
//           <span>{`${params.row.projectName.slice(0, 30)}`}</span>
//         </Tooltip>
//       ),
//     },
//     { field: "taskName", headerName: " Task Title", width: 200 },
//     { field: "userName", headerName: " Employee Name", width: 200 },

//     {
//       field: "description", headerName: " Description", renderCell: (params) => (
//         <>
//           {params?.row?.description?.length ? (
//             <DescriptionIcon className=" text-zinc-400 cursor-pointer " onClick={() =>
//               descriptionHandler(
//                 params?.row?.description,
//                 params?.row?.createdAt,
//                 params?.row?.nonBillableReason
//               )
//             } />
//           ) : (
//             "-"
//           )}
//         </>
//       ), width: 150
//     },
//     { field: "hoursByTL", headerName: "Hours By T.L", width: 200 },
//     { field: "hours", headerName: "Hours", },
//     { field: "date", headerName: " Date", width: 200 },
//     {
//       field: "",
//       headerName: "Action ",
//       width: 200,
//       renderCell: (params) => (
//         <>
//           <Link href={`/hourlogs/list/${params.row.id}`}>
//             <Button
//               className="!text-green-700 !bg-green-200 !hover:bg-green-300"
//               sx={{ minWidth: "30px" }}
//             >
//               <EditOutlinedIcon className="!w-4 h-4" />
//             </Button>
//           </Link>
//           {session && session?.data?.user?.admin == "true" && <Button
//             className="!text-red-700 !bg-red-100 mx-2 !hover:bg-red-200  "
//             sx={{ minWidth: "30px" }}
//             onClick={() => handleHoursDelete(params.row.id)}
//           >
//             <DeleteOutlineIcon className="!w-4 !h-4" />
//           </Button>}

//           <Button>
//             <Typography
//               className=""
//               onClick={() => notesHandler(params.row.id)}
//             >
//               <Badge badgeContent={params.row.notesCount} color="error">
//                 <CommentOutlinedIcon className=" text-zinc-400 cursor-pointer " />
//               </Badge>
//             </Typography>
//           </Button>
//         </>
//       ),
//     },
//   ];
//   const [deleteOpenModal, setDeleteOpenModal] = useState(false); // Modal open state
//   const [deleteId, setDeleteId] = useState(null); // Id to be deleted
//   // Function for delete functionality
//   const onDelete = async () => {
//     try {
//       const result = await HourLogsService.deleteHoursById(deleteId);
//       deleteHandleModalClose();
//       successMsg(result.message);
//       setLoading(false);
//       getAllHoursData(page, pageSize, filters);
//     } catch (error) {
//       errorMsg(error?.message);
//     }
//   };

//   const handleHoursDelete = (id) => {
//     setDeleteId(id);
//     setDeleteOpenModal(true);
//   };

//   // Function to Hours close the modal
//   const deleteHandleModalClose = () => {
//     setDeleteOpenModal(false);
//   };

//   // notes handler
//   const notesHandler = (hourId) => {

//     setHoursId(hourId);
//     setNotesModalOpen(true);
//   };

//   const notesHandleModalClose = () => {
//     setNotesModalOpen(false);
//   };

//   // for notes count update
//   const updateNotesCount = (action, hourId) => {
//     setHoursData((prevData) =>
//       prevData.map((item) =>
//         item.id === hourId
//           ? {
//             ...item,
//             notesCount:
//               action === "add" ? item.notesCount + 1 : item.notesCount - 1,
//           }
//           : item
//       )
//     );
//   };
//   const defaultStartDate = startDateQuery
//   const defaultEndDate = ebdDateQuery
//   return (
//     <>
//       <Box className="flex border-solid border-b border-slate-300 mb-7 items-center">
//         <LayoutHeader pageTitle="All Hour Logs" />
//         <Box
//           className="ml-auto flex justify-end"
//           sx={{
//             width: 180,
//           }}
//         >
//           <Link href="/hourlogs/add" className="!no-underline">
//             <Button className=" add-page-hover-btn bg-theme-red !text-white !hover:bg-orange-900 !rounded-full !py-2 !px-4 hover:bg-red-800">
//               Add Hour logs
//             </Button>
//           </Link>
//         </Box>
//       </Box>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <HoursFilter
//           control={control}
//           rhfSetValue={setValue}
//           handleChange={handlepProjectIdChange}
//           defaultStartDate={defaultStartDate}
//           defaultEndDate={defaultEndDate}
//           errors={errors}
//         />
//       </form>
//       <Card className="bg-white !shadow-2xl">
//         {loading && <Loading />}

//         {hoursData?.length > 0 ? (
//           <DataGridPagination
//             columns={hoursColumns}
//             data={hoursData}
//             page={page}
//             totalRows={totalRows}
//             setPage={setPage}
//             setPageSize={setPageSize}
//           />
//         ) : (
//           <Typography className="text-red-600 text-center my-4">
//             Data not found
//           </Typography>
//         )}
//       </Card>

//       <DeleteModal
//         onDelete={onDelete}
//         deleteMessage="Are you sure you want to delete this hours?"
//         deleteOpenModal={deleteOpenModal}
//         deleteHandleModalClose={deleteHandleModalClose}
//       />
//       <DescriptionModal
//         descriptionMessage="Hours Description"
//         descriptionHandleModalClose={descriptionHandleModalClose}
//         readMoreModalOpen={readMoreModalOpen}
//         descriptionVal={descriptionVal}
//         dateTime={dateTime}
//       // nonBillableReason={nonBillableReason}
//       // isBillableReason={isBillableReason}
//       />
//       <NotesModal
//         notesModalOpen={notesModalOpen}
//         notesHandleModalClose={notesHandleModalClose}
//         hoursId={hoursId}
//         updateNotesCount={updateNotesCount}
//       />
//     </>
//   );
// }

// export default AllHours;
