"use client";
import { useContext, useEffect, useState } from "react";
import GroupIcon from "@mui/icons-material/Group";
import ProjectService from "@/services/projectservice";
import BillableChart from "./BillableChart";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import UserChart from "./UsersChart";
import { Grid, Typography } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import useDocumentTitle from "@/app/utils/useDocumentTitle";
import { Box } from "@mui/system";
import { errorMsg } from "@/app/toster-msg/msg";
import Loading from "@/app/users/loading";
import DashBoardUserTable from "./dashboardusertable/page";
import DashboardDateFilter from "./datefilter/DashboardDateFilter";
import ProjectDetails from "./details/page";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LongTaskTable from "./longtasktable/page";
import RecentHoursTable from "./recenthour/page";
import { useForm } from "react-hook-form";
import moment, * as moments from "moment";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
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
  //for get query param from url
  const searchParams = useSearchParams();

  const startDateQuery = searchParams.get("startDate");
  const ebdDateQuery = searchParams.get("endDate");

  const projectStart = moment(projectStartDate).format("YYYY-MM-DD");
  const projectEnd = moment().format("YYYY-MM-DD");

  const [filters, setFilters] = useState({
    startDate: startDateQuery ? startDateQuery : "",
    endDate: ebdDateQuery ? ebdDateQuery : "",
  });

  const router = useRouter();
  const id = params.slug; //project id get from slug

  useDocumentTitle("Project Dashboard | Acewebx");
  const { handleSubmit, setValue } = useForm();

  const userProject = async (id, filters) => {
    try {
      const result = await ProjectService.userInProject(id, filters);
      if (result.status === true) {
        setProjectDetail(result.project);
        setTotalUserData(result.totalUsers);
        setUserData(result.totalUsers);
        setLongTaskTable(result.longTasks);
        setRecentHours(result.recentHours);
        setTotalHours(result);
        setLoading(false);
        setProjectStartDate(result.project?.project_startDate);
        setProjectEndDate(result.project?.project_endDate);
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
    router.push(`/projects/list/${id}/dashboard?${queryString}`);
    userProject(id, filterData);
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
  const { setTitle } = useContext(UserContext);
  setTitle("Project Dashboard");
  return (
    <>
      <div>
        {loading && <Loading />}
        <form onSubmit={handleSubmit(onSubmit)} className=" mb-5 ">
          {response === true && (
            <DashboardDateFilter
              rhfSetValue={setValue}
              startDefaultDate={projectStart}
              endDefaultDate={projectEnd}
            />
          )}
        </form>

        {/* Boxes Start :) */}
        <div className="grid grid-cols-4 gap-4">
          <Grid item xs={3} md={3}>
            <Link
              className={userData?.length > 0 < 1 ? "linkdisable" : ""}
              href={`/graphrecord?startDate=${
                startDate == "" ? projectStart : startDate
              }&endDate=${endDate == "" ? projectEnd : endDate}&isBillable=${
                totalHours.totalBillable > 0 ? 1 : 1
              }&projectId=${id}${
                userBillableIds.length > 0 ? `&userId=${userBillableIds}` : ""
              }`}
            >
              <Box className="bg-gradient-to-r from-[#FF9319] to-[#99580F] text-white py-4 p-4 rounded-lg">
                <Typography
                  component="div"
                  className="flex gap-6  justify-center items-center "
                >
                  <Typography>
                    {/* <PriceCheckIcon className="!text-7xl" /> */}
                    <div className="">
                      <img
                        src="/assets/images/total-billable.png"
                        className="billable"
                        alt="total billable"
                      />
                    </div>
                  </Typography>
                  <Typography className="!text-2xl">
                    <b>{totalHours.totalBillable} </b>
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
              }&projectId=${id}${
                userNonBillableIds.length > 0
                  ? `&userId=${userNonBillableIds}`
                  : ""
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
                    <b>{totalHours.totalNonBillable}</b>
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
              }&isBillable=${""}&projectId=${id}&userId=${usersList}`}
            >
              <Box className="bg-gradient-to-r from-[#067C25] to-[#0BE244] text-white py-4 p-4 rounded-lg">
                <Typography
                  component="div"
                  className="flex gap-6 justify-center items-center "
                >
                  <Typography>
                    <Typography>
                      <div className="">
                        <img
                          src="/assets/images/total-user.png"
                          className="billable"
                          alt="total billable"
                        />
                      </div>
                    </Typography>
                  </Typography>
                  <Typography className="!text-2xl">
                    <b> {totalUserData?.length}</b> <ArrowDropUpIcon />
                    <Typography>Total Work By Users</Typography>
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
              }&isBillable=${""}&projectId=${id}&userId=${usersList}`}
            >
              <Box className="bg-gradient-to-r from-[#00C6CD] via-[#00959A] to-[#006367] text-white py-4 p-4 rounded-lg">
                <Typography
                  component="div"
                  className="flex gap-6 justify-center items-center "
                >
                  <Typography>
                    <Typography>
                      <div className="">
                        <img
                          src="/assets/images/total-task-hour.png"
                          className="billable"
                          alt="total billable"
                        />
                      </div>
                    </Typography>
                  </Typography>
                  <Typography className="!text-2xl">
                    <b> {totalHours.totalTasks}</b> <ArrowDropUpIcon />
                    <Typography>Total Task</Typography>
                  </Typography>
                </Typography>
              </Box>{" "}
            </Link>
          </Grid>
        </div>

        <div className="flex justify-between gap-4">
          {/* ProjectDetails :) */}
          <div className="  w-[50%]">
            <Grid
              item
              xs={12}
              md={12}
              className="border border-gray-400 pt-0 rounded-xl w-full !h-[30rem] shadow-xl pb-2 !mt-5 "
            >
              <ProjectDetails projectDetail={projectDetail} />
            </Grid>
          </div>
          {/* DashBoardUserTable :) */}
          <Grid
            item
            className="border border-gray-400 pt-0 !h-[30rem] overflow-auto rounded-xl w-full h-fit shadow-xl pb-2 !mt-5 "
          >
            <DashBoardUserTable
              totalUserData={totalUserData}
              projectId={id}
              startDate={startDate}
              endDate={endDate}
            />
          </Grid>
        </div>

        <div className="mt-5">
          {userData && userData?.length > 0 ? (
            <>
              {/* BillableChart :) */}
              <div className="grid grid-cols-2 gap-4">
                <Grid item xs={6} md={6}>
                  <BillableChart
                    totalHours={totalHours}
                    projectId={id}
                    startDate={filters.startDate}
                    endDate={filters.endDate}
                  />
                </Grid>
                {/* UserChart :) */}
                <Grid item xs={6} md={6}>
                  <UserChart
                    userData={userData}
                    projectId={id}
                    startDate={filters.startDate}
                    endDate={filters.endDate}
                  />
                </Grid>
              </div>

              {/* LongTaskTable :) */}
              <Grid item xs={12} md={12} className=" pt-0 !mt-5">
                <div
                  className="border border-gray-400 pt-0 
              rounded-xl shadow-xl pb-2"
                >
                  <LongTaskTable longTaskTable={longTaskTable} />
                </div>
              </Grid>

              {/* RecentHoursTable :) */}
              <Grid item xs={12} md={12} className="pt-0 !mt-5">
                <div
                  className="border border-gray-400 pt-0 
              rounded-xl shadow-xl pb-2"
                >
                  <RecentHoursTable recentHours={recentHours} />
                </div>
              </Grid>
            </>
          ) : (
            <>
              <div className="text-center w-full">
                <Typography className="text-red-500  p-4">
                  No user data available
                </Typography>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
