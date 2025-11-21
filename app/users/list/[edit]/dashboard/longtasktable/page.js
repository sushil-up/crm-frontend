"use client";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Divider,
} from "@mui/material";
import LayoutHeader from "@/app/layoutHeader";
import DescriptionModal from "@/models/DescriptionModal";
import { useState } from "react";
export default function UserLongTaskTable({ longTaskTable }) {
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
      <div  className="mb-3 border border-[#FFD4D4] bg-white rounded-[5px] w-full p-4">  
        <LayoutHeader pageTitle="Long Time Task" />
      </div>
      <div className="px-2 mt-2">
        <Table>
          <TableHead className="hour-tablehead bg-stone-200">
            <TableRow>
              <TableCell className="w-1/4 !p-4 bg-theme-color !text-white">
                Task Title
              </TableCell>
              <TableCell className=" w-2/4 !p-4 bg-theme-color !text-white">
                Task Description
              </TableCell>
              <TableCell className="!p-4 bg-theme-color !text-white">
                All Hours
              </TableCell>
              <TableCell className="!p-4 bg-theme-color !text-white">
                Billable
              </TableCell>
              <TableCell className="!p-4 bg-theme-color !text-white">
                Non Billable
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {longTaskTable?.length > 0 ? (
              longTaskTable.slice(0, 10)?.map((item, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{item.title}</TableCell>

                    <TableCell className="">
                      <span
                        className="text-sm capitalize min-w-0 cursor-pointer"
                        onClick={() => descriptionHandler(item.taskDescription)}
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: item.taskDescription.slice(0, 80) || "-",
                          }}
                        />
                        {/* {`${item.taskDescription.slice(0, 95)}...`} */}
                      </span>
                    </TableCell>
                    <TableCell>{item.totalHours}</TableCell>
                    <TableCell>{item.billable}</TableCell>

                    <TableCell>{item.nonBillable}</TableCell>
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
