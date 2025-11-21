"use client";
import { useContext, useEffect, useState } from "react";
import ProjectService from "@/services/projectservice";
import LayoutHeader from "@/app/layoutHeader";
import DataFiltter from "./dataFilterhourlogs/DataFiltterhourelog";
import { errorMsg } from "@/app/toster-msg/msg";
import DescriptionModal from "@/models/DescriptionModal";
import useDocumentTitle from "@/app/utils/useDocumentTitle";
import moment from "moment";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import NotesModal from "@/models/NotesModal";
import Loading from "@/app/users/loading";
import HourLogsService from "@/services/hourlogservice";
import DailyReportingTable from "./table/DailyReportingTable copy";
import UserContext from "@/context/UserContext";

export default function AllHoursProject() {
  const [hydrated, setHydrated] = useState(false);
  const [nonBillableReason, setNonBillableReason] = useState();
  const [hoursData, setHoursData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [readMoreModalOpen, setReadMoreModalOpen] = useState(false); // Modal open state
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [dateTime, setDateTime] = useState();
  const [hoursId, setHoursId] = useState();
  const [descriptionVal, setDescriptionVal] = useState();
  const [projectId, setProjectId] = useState();
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectName, setProjectName] = useState([]);
  const [userName, setUserName] = useState([]);
  //get query params from url
  const searchParams = useSearchParams();
  const projectQuery = searchParams.get("projectId");
  const startDateQuery = searchParams.get("startDate");
  const ebdDateQuery = searchParams.get("endDate");
  const isBillableQuery = searchParams.get("isBillable");
  const [filters, setFilters] = useState({
    projectId: projectQuery ? projectQuery : "",
    startDate: startDateQuery ? startDateQuery : moment().format("YYYY-MM-DD"),
    endDate: ebdDateQuery ? ebdDateQuery : moment().format("YYYY-MM-DD"),
    isBillable: isBillableQuery ? isBillableQuery : "",
  });

  const router = useRouter();
  useDocumentTitle("Hours By Project | Acewebx"); //page title
  const getProjectData = async () => {
    try {
      const projectData = await HourLogsService.getSelectProjects();
      setProjectName(projectData.data);

      const filteredProject = projectData.data.find(
        (item) => item.id == projectQuery
      );

      if (filteredProject) {
        setSelectedProject(filteredProject);
        setProjectId(filteredProject.id);
        setValue("project_id", filteredProject); // ✅ This line sets the field in the form
        setFilters((prev) => ({
          ...prev,
          projectId: filteredProject.id,
        }));
      } else {
        setSelectedProject("All");
        setValue("project_id", "All"); // ✅ Set 'All' in form as fallback
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
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      startDate: "",
      endDate: "",
      project_id: "All",
      isBillable: "3",
    },
  });

  //get the all hour logs data
  const getAllData = async (filters) => {
    setLoading(true);

    try {
      const allhours = await ProjectService.getHoursLogByProject(filters);
      setHoursData(allhours.data);
      setLoading(false);
    } catch (error) {
      errorMsg(error?.message);
    }
  };

  useEffect(() => {
    getAllData(filters);

    //notes scroll handler
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 300); // Change 300 to the scroll position to fix the header
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [filters]);

  //description modal open
  const descriptionHandler = (description, createdAt, nonReason) => {
    setReadMoreModalOpen(true);
    setDescriptionVal(description);
    setDateTime(createdAt);
    setNonBillableReason(nonReason);
  };

  const descriptionHandleModalClose = () => {
    setReadMoreModalOpen(false);
  };

  //notes handler
  const notesHandler = (hours, users) => {
    setHoursId(hours);
    setNotesModalOpen(true);
    setUserName(users);
  };

  const notesHandleModalClose = () => {
    setNotesModalOpen(false);
  };

  // for notescount update
  const updateNotesCount = (action, hourId) => {
    setHoursData((prevData) =>
      prevData.map((projects) => ({
        ...projects,
        projects: projects.projects.map((project) => ({
          ...project,
          projectTasks: project.projectTasks.map((item) =>
            item.hourId === hourId
              ? {
                  ...item,
                  notesCount:
                    action === "add"
                      ? item.notesCount + 1
                      : item.notesCount - 1,
                }
              : item
          ),
        })),
      }))
    );
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);

    data.project_id = projectId;
    let filterData = {
      startDate: data.startDate,
      endDate: data.endDate,
      projectId: data.project_id ? data.project_id : "",
      isBillable: data.isBillable,
    };
    const queryString = new URLSearchParams(filterData).toString();
    setFilters(filterData);
    setLoading(false);

    router.push(`/dailyreporting/by-project?${queryString}`);
    getAllData(filterData);
  };
  //project handler
  const handleProjectChange = (e) => {
    setValue("project_id", e);
    setProjectId(e?.value);
  };
  const defaultStartDate = startDateQuery;
  const defaultEndDate = ebdDateQuery;
  useEffect(() => {
    setValue("isBillable", isBillableQuery || "3");
  }, [isBillableQuery]);
  const { setTitle } = useContext(UserContext);
  setTitle(" All Hours Log By Project");
  useEffect(() => {
    setHydrated(true); // Mark that we are on the client now
  }, []);

  if (!hydrated) {
    return null; // Prevent SSR/client mismatch
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className=" !px-0">
        <DataFiltter
          rhfSetValue={setValue}
          control={control}
          handleChange={handleProjectChange}
          defaultStartDate={defaultStartDate}
          defaultEndDate={defaultEndDate}
        />
      </form>
      {loading && <Loading />}
      <DailyReportingTable
        hasScrolled={hasScrolled}
        hoursData={hoursData}
        notesHandler={notesHandler}
        getProjectData={getProjectData}
        descriptionHandler={descriptionHandler}
        getAllData={getAllData}
        filters={filters}
        setLoading={setLoading}
      />

      <DescriptionModal
        descriptionMessage="User Hours Description"
        descriptionHandleModalClose={descriptionHandleModalClose}
        readMoreModalOpen={readMoreModalOpen}
        descriptionVal={descriptionVal}
        dateTime={dateTime}
        nonBillableReason={nonBillableReason}
      />
      <NotesModal
        notesModalOpen={notesModalOpen}
        notesHandleModalClose={notesHandleModalClose}
        hoursId={hoursId}
        setNotesModalOpen={setNotesModalOpen}
        updateNotesCount={updateNotesCount}
        userName={userName}
      />
    </>
  );
}
