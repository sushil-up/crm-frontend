"use client";
import { useContext, useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import useDocumentTitle from "@/app/utils/useDocumentTitle";
import { Box } from "@mui/system";
import { errorMsg } from "@/app/toster-msg/msg";
import Loading from "@/app/users/loading";
import { useForm } from "react-hook-form";
import moment, * as moments from "moment";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import DashboardDateFilterUser from "./datefilter/DashboardDateFilterUser";
import UsersBillableChart from "./UsersBillableChart";
import UserDetailsChart from "./UserDetailsChart";
import UserRecentHoursTable from "./recenthour/page";
import UserLongTaskTable from "./longtasktable/page";
import usersService from "@/services/usersService";
import { useSession } from "next-auth/react";
import UserContext from "@/context/UserContext";

function Dashboard({ params }) {
  const [userData, setUserData] = useState(null);
  const [recentHours, setRecentHours] = useState();
  const [longTaskTable, setLongTaskTable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectDetail, setProjectDetail] = useState([]);
  const [totalUserData, setTotalUserData] = useState([]);
  const [totalHours, setTotalHours] = useState([]);
  const [projectStartDate, setProjectStartDate] = useState();
  const [projectEndDate, setProjectEndDate] = useState();
  const [response, setResonse] = useState(false);
  //for getting query param from url :)
  const searchParams = useSearchParams();
  const startDateQuery = searchParams.get("startDate");
  const ebdDateQuery = searchParams.get("endDate");
  const projectStart = moment(projectStartDate).format("YYYY-MM-DD");
  const projectEnd = moment().format("YYYY-MM-DD");

  const [filters, setFilters] = useState({
    startDate: startDateQuery ? startDateQuery : "",
    endDate: ebdDateQuery ? ebdDateQuery : "",
  });

  const session = useSession();
  const adminUser = session?.data?.user?.admin;

  const router = useRouter();
  const id = params.edit; //user id get from slug

  useDocumentTitle("User Dashboard | Acewebx");
  0;
  const { handleSubmit, setValue } = useForm();

  const userProject = async (id, filters) => {
    try {
      const result = await usersService.singleUserDetails(id, filters);
      if (result.status === true) {
        setProjectDetail(result?.data.project);
        setTotalUserData(result?.data.totalProjects);
        setUserData(result?.data.totalProjects);
        setLongTaskTable(result?.data.longTasks);
        setRecentHours(result?.data.recentHours);
        setTotalHours(result?.data);
        setLoading(false);
        setProjectStartDate(result?.data?.project_startDate);
        setProjectEndDate(result?.data.project?.project_endDate);
        setResonse(true);
      }
    } catch (error) {
      setUserData([]);
      errorMsg(error?.message);
    }
  };

  //use effect
  useEffect(() => {
    userProject(id, filters);
  }, [filters]);

  // filterdata on submit
  const onSubmit = (data) => {
    let filterData = {
      startDate: data.startDate ? data.startDate : projectStart,
      endDate: data.endDate ? data.endDate : projectEnd,
    };
    const queryString = new URLSearchParams(filterData).toString();
    setFilters(filterData);
    router.push(`/users/list/${id}/dashboard?${queryString}`);
    userProject(id, filterData);
  };

  const hoursHandler = (billable, nonbillable) => {
    setVisitBillable(billable);
    setVisitNonBillable(nonbillable);
  };

  const userBillableIds = []; // for collecting billble user Id :)
  const userNonBillableIds = []; // for collecting nonbillable user Id :)

  userData?.forEach((element) => {
    const billable = parseInt(element["billableHours"]);
    if (billable > 0) {
      userBillableIds.push(element["id"]);
    }

    const nonBillable = parseInt(element["nonBillableHours"]);
    if (nonBillable > 0) {
      userNonBillableIds.push(element["id"]);
    }
  });

  let usersList = userData?.map((user) => user.id);
  const { startDate, endDate } = filters;

  useEffect(() => {
    if (adminUser !== "true") {
      router.back();
    }
  }, [adminUser]);
  const { setTitle } = useContext(UserContext);
  setTitle("User Dashboard");
  return (
    <>
      {loading && <Loading />}
      <div className="bg-white user-detail">
        <span className="user-heading block ">
          <b>User Detail</b>
        </span>
        <div className="p-3">
          <span className="text-sm inline-block">
            <b>User Name :</b> {totalHours?.userName}
          </span>
          <br></br>
          <span className="text-sm inline-block">
            <b>User Email :</b> {totalHours?.userEmail}
          </span>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className=" mb-5 mt-5">
        {response === true && (
          <DashboardDateFilterUser
            rhfSetValue={setValue}
            startDefaultDate={projectStart}
            endDefaultDate={projectEnd}
          />
        )}
      </form>

      <>
        {/* Boxes Start :) */}
        <Grid container spacing={2} className=" text-xl ">
          <Grid item xs={3} md={3}>
            <Link
              className={userData?.length > 0 < 1 ? "linkdisable" : ""}
              href={`/graphrecord?startDate=${
                startDate == "" ? projectStart : startDate
              }&endDate=${endDate == "" ? projectEnd : endDate}&isBillable=${
                totalHours.totalBillable > 0 ? 1 : 1
              }&projectId=${usersList}${
                userBillableIds.length > 0 ? `&userId=${id}` : ""
              }`}
            >
              <Box className="bg-gradient-to-r from-[#FF9319] to-[#99580F] text-white py-4 p-4 rounded-lg">
                <Typography
                  component="div"
                  className="flex gap-6  justify-center items-center "
                >
                  <Typography>
                    <div className="">
                      <img
                        src="/assets/images/total-billable.png"
                        className="billable"
                        alt="total billable"
                      />
                    </div>
                  </Typography>
                  <Typography className="!text-2xl">
                    <b>{totalHours?.totalBillable}</b>
                    <ArrowDropUpIcon />
                    <Typography className="text-justify">
                      Total Billable
                    </Typography>
                  </Typography>
                </Typography>
              </Box>
            </Link>
          </Grid>

          <Grid item xs={3} md={3}>
            <Link
              className={userData?.length > 0 < 1 ? "linkdisable" : ""}
              href={`/graphrecord?startDate=${
                startDate == "" ? projectStart : startDate
              }&endDate=${endDate == "" ? projectEnd : endDate}&isBillable=${
                totalHours.totalNonBillable > 0 ? 0 : 0
              }&projectId=${usersList}${
                userNonBillableIds.length > 0 ? `&userId=${id}` : ""
              }`}
            >
              <Box className="bg-gradient-to-r from-[#B82025] to-[#520E10] text-white py-4 p-4 rounded-lg">
                <Typography
                  component="div"
                  className="flex gap-6 justify-center items-center "
                >
                  <Typography>
                    <div className="">
                      <img
                        src="/assets/images/non-bilable.png"
                        className="billable"
                        alt="total billable"
                      />
                    </div>
                  </Typography>
                  <Typography className="!text-2xl">
                    <b>{totalHours.totalNonBillable} </b>
                    <ArrowDropUpIcon />
                    <Typography className="">Total Non Billable</Typography>
                  </Typography>
                </Typography>
              </Box>
            </Link>
          </Grid>

          <Grid item xs={3} md={3}>
            <Link
              className={userData?.length > 0 < 1 ? "linkdisable" : ""}
              href={`/graphrecord?startDate=${
                startDate == "" ? projectStart : startDate
              }&endDate=${
                endDate == "" ? projectEnd : endDate
              }&isBillable=${""}&projectId=${usersList}&userId=${id}`}
            >
              <Box className="bg-gradient-to-r from-[#067C25] to-[#0BE244] text-white py-4 p-4 rounded-lg">
                <Typography
                  component="div"
                  className="flex gap-6 justify-center items-center "
                >
                  <Typography>
                    <div className="">
                      <img
                        src="/assets/images/total-user.png"
                        className="billable"
                        alt="total billable"
                      />
                    </div>
                  </Typography>
                  <Typography className="!text-2xl">
                    <b> {totalUserData?.length}</b> <ArrowDropUpIcon />
                    <Typography>Projects Done by User</Typography>
                  </Typography>
                </Typography>
              </Box>
            </Link>
          </Grid>

          <Grid item xs={3} md={3}>
            <Link
              className={userData?.length > 0 < 1 ? "linkdisable" : ""}
              href={`/graphrecord?startDate=${
                startDate == "" ? projectStart : startDate
              }&endDate=${
                endDate == "" ? projectEnd : endDate
              }&isBillable=${""}&projectId=${usersList}&userId=${id}`}
            >
              <Box className="bg-gradient-to-r from-[#00C6CD] via-[#00959A] to-[#006367] text-white py-4 p-4 rounded-lg">
                <Typography
                  component="div"
                  className="flex gap-6 justify-center items-center "
                >
                  <Typography>
                    <img
                      src="/assets/images/total-task-hour.png"
                      className="billable"
                      alt="total billable"
                    />
                  </Typography>
                  <Typography className="!text-2xl">
                    <b> {totalHours.totalTasks}</b> <ArrowDropUpIcon />
                    <Typography>Total Task</Typography>
                  </Typography>
                </Typography>
              </Box>
            </Link>
          </Grid>
          {/* Boxes End :) */}

          {/* BillableChart :) */}
          <Grid item xs={6} md={6}>
            <UsersBillableChart
              id={id}
              totalHours={totalHours}
              projectId={usersList}
              startDate={filters.startDate}
              endDate={filters.endDate}
            />
          </Grid>
          {/* UserChart :) */}
          <Grid item xs={6} md={6}>
            <UserDetailsChart
              id={id}
              userData={userData}
              projectId={usersList}
              startDate={filters.startDate}
              endDate={filters.endDate}
            />
          </Grid>

          {/* LongTaskTable :) */}
          <Grid item xs={12} md={12} className="pt-0 !mt-5">
            <div
              className="border border-gray-400 pt-0 
              rounded-xl shadow-xl pb-2"
            >
              <UserLongTaskTable longTaskTable={longTaskTable} />
            </div>
          </Grid>

          {/* RecentHoursTable :) */}
          <Grid item xs={12} md={12} className="pt-0 !mt-5">
            <div
              className="border border-gray-400 pt-0 
          rounded-xl shadow-xl pb-2"
            >
              <UserRecentHoursTable recentHours={recentHours} />
            </div>
          </Grid>
        </Grid>
      </>
    </>
  );
}

export default Dashboard;
