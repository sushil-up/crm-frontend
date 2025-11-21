"use client";
import { useState, useEffect, useContext } from "react";
import UserFiltter from "@/services/userfiltter";
import DataFiltter from "./filtterData/DataFiltter";
import LayoutHeader from "@/app/layoutHeader";
import { errorMsg } from "@/app/toster-msg/msg";
import Loading from "@/app/users/loading";
import DescriptionModal from "@/models/DescriptionModal";
import useDocumentTitle from "@/app/utils/useDocumentTitle";
import { useSearchParams } from "next/navigation";
import moment, * as moments from "moment";
import { updateNotesCount } from "@/app/utils/NotesCount";
import NotesModal from "@/models/NotesModal";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import usersService from "@/services/usersService";
// import DailyReportingTable from "./table/DailyReportingTable";
import DailyReportingTable from "./table/DailyReportingTable copy";
import UserContext from "@/context/UserContext";
export default function BasicAccordion() {
  const [hydrated, setHydrated] = useState(false);
  //PAGE TITLE
  useDocumentTitle("Hours By User | Acewebx");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  // Modal open state :)
  const [readMoreModalOpen, setReadMoreModalOpen] = useState(false);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [descriptionVal, setDescriptionVal] = useState();
  const [dateTime, setDateTime] = useState();
  const [hoursId, setHoursId] = useState();
  const [nonBillableReason, setNonBillableReason] = useState();
  const [userId, setUserId] = useState();
  const searchParams = useSearchParams();
  const userQuery = searchParams.get("userId");
  const startDateQuery = searchParams.get("startDate");
  const ebdDateQuery = searchParams.get("endDate");
  const isBillableQuery = searchParams.get("isBillable");
  const [userName, setUserName] = useState([]);

  //get user list data
  const getUserData = async () => {
    try {
      const dataUser = await usersService.getSelectUsers();
      const filterUser = dataUser?.data.filter((item) => item.id == userQuery);

      if (filterUser && filterUser.length > 0) {
        setValue("user_id", filterUser[0]?.full_name || filterUser[0].label);
        setUserId(filterUser[0].id);
      } else {
        setValue("user_id", "All");
      }
    } catch (error) {
      errorMsg(error?.message);
    }
  };

  useEffect(() => {
    getUserData();
  }, [userQuery]);
  const [filters, setFilters] = useState({
    userId: userQuery ? userQuery : "",
    startDate: startDateQuery ? startDateQuery : moment().format("YYYY-MM-DD"),
    endDate: ebdDateQuery ? ebdDateQuery : moment().format("YYYY-MM-DD"),
    isBillable: isBillableQuery ? isBillableQuery : "",
  });

  const router = useRouter();
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      startDate: "",
      endDate: "",
      user_id: "All",
      isBillable: "3",
    },
  });
  // Form control initialization using react-hook-form ---:)
  const getAllData = async (filters) => {
    try {
      setLoading(true);
      const allTasks = await UserFiltter.getHoursLogGroupByUsers(filters);
      setData(allTasks.data);
      setLoading(false);
    } catch (error) {
      errorMsg(error?.message);
    }
  };

  useEffect(() => {
    getAllData(filters);
    const handleScroll = () => {
      // Update the hasScrolled state based on the scroll position
      setHasScrolled(window.scrollY > 300); // Change 300 to the scroll position where you want to fix the header
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
  const notesHandler = (hourId, users) => {
    setHoursId(hourId);
    setUserName(users);
    
    setNotesModalOpen(true);
  };
  
  const notesHandleModalClose = () => {
    setNotesModalOpen(false);
  };
  
  // for notes counter update :)
  const updateNotesCountWrapper = (action, hoursId) => {
    setData(updateNotesCount(data, action, hoursId));
  };
  
  //filter handler :)
  const onSubmit = async (data) => {
    setLoading(true);
    data.user_Id = userId;
    let filterData = {
      startDate: data.startDate,
      endDate: data.endDate,
      userId: data.user_Id ? data.user_Id : "",
      isBillable: data.isBillable,
    };
    
    const queryString = new URLSearchParams(filterData).toString();
    setFilters(filterData);
    setLoading(false);
    
    router.push(`/dailyreporting/by-user?${queryString}`);
    getAllData(filterData);
  };
  
  //set user handler
  const handlUserChange = (e) => {
    setValue("user_id", e?.full_name);
    setUserId(e?.id);
  };
  useEffect(() => {
    setValue("isBillable", isBillableQuery || "3");
  }, [isBillableQuery]);
  const defaultStartDate = startDateQuery;
  const defaultEndDate = ebdDateQuery;
  const { setTitle } = useContext(UserContext);
  setTitle("All Hours Log By User");
  
  useEffect(() => {
    setHydrated(true); // Mark that we are on the client now
  }, []);

  if (!hydrated) {
    return null; // Prevent SSR/client mismatch
  }
  return (
    <div suppressHydrationWarning>
    

      <form onSubmit={handleSubmit(onSubmit)} className=" !px-0">
        <DataFiltter
          idUser={userQuery}
          rhfSetValue={setValue}
          handleChange={handlUserChange}
          control={control}
          defaultStartDate={defaultStartDate}
          defaultEndDate={defaultEndDate}
        />
      </form>

      {loading && <Loading />}
      <DailyReportingTable
        getAllData={getAllData}
        filters={filters}
        hasScrolled={hasScrolled}
        data={data}
        notesHandler={notesHandler}
        descriptionHandler={descriptionHandler}
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
        updateNotesCount={updateNotesCountWrapper}
        userName={userName}
      />
    </div>
  );
}
