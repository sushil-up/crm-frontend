"use client";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from "@mui/material";
import LayoutHeader from "@/app/layoutHeader";
import DescriptionModal from "@/models/DescriptionModal";
import { useState } from "react";
export default function RecentHoursTable({ recentHours }) {
  const [readMoreModalOpen, setReadMoreModalOpen] = useState(false); // Modal open state
  const [descriptionVal, setDescriptionVal] = useState();
  const descriptionHandleModalClose = () => {
    setReadMoreModalOpen(false);
  };

  const descriptionHandler = (description) => {
    setReadMoreModalOpen(true);
    setDescriptionVal(description);
  };
  return (
    <>
      <div className="flex mb-3 border border-[#FFD4D4] bg-white rounded-[5px] w-full p-4">
        <LayoutHeader pageTitle="Recent Hours" />
      </div>
      <div className="px-2 mt-2">
        <Table>
          <TableHead className="hour-tablehead bg-stone-200">
            <TableRow>
              <TableCell className="!p-4 bg-theme-color !text-white">
                Name
              </TableCell>
              <TableCell className="w-1/4 !p-4 bg-theme-color !text-white">
                Task
              </TableCell>
              <TableCell className=" w-2/4 !p-4 bg-theme-color  !text-white">
                Description
              </TableCell>
              <TableCell className="!p-4 bg-theme-color !text-white">
                Hours
              </TableCell>
              <TableCell className="!p-4 bg-theme-color !text-white">
                is Billable
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentHours?.length > 0 ? (
              recentHours?.map((item, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{item.user.name}</TableCell>
                    <TableCell>{item.task}</TableCell>
                    <TableCell className="w-0">
                      <span
                        className="text-sm capitalize min-w-0 cursor-pointer"
                        onClick={() => descriptionHandler(item.description)}
                      >
                          <div
                          dangerouslySetInnerHTML={{
                            __html: item.description.slice(0, 80) || "-",
                          }}
                        />
                      </span>
                    </TableCell>
                    <TableCell>
                      {item.nonBillableHours !== "0:00" &&
                        item.nonBillableHours}
                      {item.billableHours !== "0:00" && item.billableHours}
                    </TableCell>
                    <TableCell>
                      {item.nonBillableHours !== "0:00" && "Non Billable"}
                      {item.billableHours !== "0:00" && "Billable"}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan="7">
                  <Typography className="text-red-500 text-center">
                    Data Not Found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DescriptionModal
        descriptionMessage="User Hours Description"
        descriptionHandleModalClose={descriptionHandleModalClose}
        readMoreModalOpen={readMoreModalOpen}
        descriptionVal={descriptionVal}
      />
    </>
  );
}
