"use client";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import useDocumentTitle from "@/app/utils/useDocumentTitle";
import moment from "moment";
import LayoutHeader from "@/app/layoutHeader";

export default function UserDetails({ userDetail }) {
  useDocumentTitle("User Details | Acewebx");
  return (
    <>
      <div  className="mb-3 border border-[#FFD4D4] bg-white rounded-[5px] w-full p-4">  
        <LayoutHeader pageTitle="User Detail" />
      </div>
      <div className="px-2 mt-2">
        {userDetail !== undefined ? (
          <CardContent className="mt-4">
            <Typography
              className="capitalize"
              sx={{ fontSize: 15 }}
              gutterBottom
            >
              <b> User Name :- </b>
              {userDetail?.project_name}
            </Typography>
            <Typography
              className="capitalize"
              sx={{ fontSize: 15 }}
              gutterBottom
            >
              <b> User Description :- </b> {userDetail.project_description}
            </Typography>
            <Typography
              className="capitalize"
              sx={{ fontSize: 15 }}
              gutterBottom
            >
              <b> Client :- </b>
              {userDetail.project_client}
            </Typography>
            <Typography
              className="capitalize"
              sx={{ fontSize: 15 }}
              gutterBottom
            >
              <b>User Status :- </b>
              {userDetail.project_status}
            </Typography>
            <Typography
              className="capitalize"
              sx={{ fontSize: 15 }}
              gutterBottom
            >
              <b>Project Start Date :- </b>
              {moment(userDetail.project_startDate).format("YYYY-MM-DD")}
            </Typography>
            <Typography
              className="capitalize"
              sx={{ fontSize: 15 }}
              gutterBottom
            >
              <b>Project End Date :- </b>
              {moment(userDetail.project_endDate).format("YYYY-MM-DD")}
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
