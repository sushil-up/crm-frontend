"use client";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import useDocumentTitle from "@/app/utils/useDocumentTitle";
import moment from "moment";
import LayoutHeader from "@/app/layoutHeader";

export default function ProjectDetails({ projectDetail }) {
  useDocumentTitle("Project Details | Acewebx");

  return (
    <>
      <div className="flex w-full p-4 border-b border-[#B2B2B2]  !text-[23px]">
        <div variant="" className="font-semibold text-[#B82025]  inline-block">
          Project Detail
        </div>
      </div>
      <div className="px-2 mt-2">
        {projectDetail !== undefined ? (
          <CardContent className="mt-4">
            <Typography
              className="capitalize"
              sx={{ fontSize: 15 }}
              gutterBottom
            >
              <div className=" flex justify-between pb-6">
                <div className="text-lg">
                  <h3> Project Name :- </h3>
                </div>
                <div className="text-[#5B5B5B] text-lg">
                  {projectDetail?.project_name}
                </div>
              </div>
            </Typography>
            <Typography
              className="capitalize"
              sx={{ fontSize: 15 }}
              gutterBottom
            >
              <div className=" flex justify-between pb-6">
                <div className="text-lg">
                  <h3> Project Description :- </h3>{" "}
                </div>
                <div className="text-[#5B5B5B] text-lg">
                  {projectDetail.project_description}
                </div>
              </div>
            </Typography>
            <Typography
              className="capitalize"
              sx={{ fontSize: 15 }}
              gutterBottom
            >
              <div className=" flex justify-between pb-6">
                <div className="text-lg">
                  <h3> Project Client :- </h3>
                </div>
                <div className="text-[#5B5B5B] text-lg">
                  {projectDetail.project_client}
                </div>
              </div>
            </Typography>
            <Typography
              className="capitalize"
              sx={{ fontSize: 15 }}
              gutterBottom
            >
              <div className=" flex justify-between pb-6">
                <div className="text-lg">
                  <h3>Project Status :- </h3>
                </div>
                <div className="text-[#5B5B5B] text-lg">
                  {projectDetail.project_status}
                </div>
              </div>
            </Typography>
            <Typography
              className="capitalize"
              sx={{ fontSize: 15 }}
              gutterBottom
            >
              <div className=" flex justify-between pb-6">
                <div className="text-lg">
                  <h3>Project Start Date :- </h3>
                </div>
                <div className="text-[#5B5B5B] text-lg">
                  {moment(projectDetail.project_startDate).format("YYYY-MM-DD")}
                </div>
              </div>
            </Typography>
            <Typography
              className="capitalize"
              sx={{ fontSize: 15 }}
              gutterBottom
            >
              <div className=" flex justify-between pb-6">
                <div className="text-lg">
                  <h3>Project End Date :- </h3>
                </div>
                <div className="text-[#5B5B5B] text-lg">
                  {moment(projectDetail.project_endDate).format("YYYY-MM-DD")}
                </div>
              </div>
            </Typography>
          </CardContent>
        ) : (
          <Card>
            <CardContent className="mt-9">
              <Typography className="text-red-500 text-center">
                Data Not Found
              </Typography>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
