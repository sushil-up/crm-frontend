"use client";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from "@mui/material";
import { getHealthIcon } from "@/app/utils/HealthPercentage";
import LayoutHeader from "@/app/layoutHeader";
import Link from "next/link";
export default function DashBoardUserTable({
  totalUserData,
  projectId,
  startDate,
  endDate,
}) {
  return (
    <>
      <div className="flex w-full p-4 border-b border-[#B2B2B2]  !text-[23px]">
        <div variant="" className="font-semibold text-[#B82025]  inline-block">
          Project Health
        </div>
      </div>
      <div className="px-2 mt-2">
        <Table>
          <TableHead className="hour-tablehead bg-stone-200">
            <TableRow>
              <TableCell className="!p-4 bg-theme-color !text-white">
                Users
              </TableCell>
              <TableCell className="!p-4 bg-theme-color !text-white">
                Total Hours
              </TableCell>
              <TableCell className="!p-4 bg-theme-color !text-white">
                Billable
              </TableCell>
              <TableCell className="!p-4 bg-theme-color !text-white">
                Non Billable
              </TableCell>
              <TableCell className="!p-4 bg-theme-color !text-white">
                Health
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {totalUserData?.length > 0 ? (
              totalUserData?.map((item, index) => {
                const health = parseInt(item.health);
                const healthIcon = getHealthIcon(health);

                return (
                  <TableRow key={index}>
                    <TableCell className="font-extrabold">
                      <Link
                        href={`/graphrecord/?startDate=${startDate}&endDate=${endDate}&projectId=${projectId}&userId=${
                          item.id
                        }&isBillable=${""}`}
                      >
                        {item.full_name}
                      </Link>
                    </TableCell>
                    <TableCell className="font-extrabold">
                      <Link
                        href={`/graphrecord/?startDate=${startDate}&endDate=${endDate}&projectId=${projectId}&userId=${
                          item.id
                        }&isBillable=${""}`}
                      >
                        {item.totalHours}
                      </Link>
                    </TableCell>
                    <TableCell className="font-extrabold">
                      <Link
                        href={`/graphrecord/?startDate=${startDate}&endDate=${endDate}&projectId=${projectId}&userId=${
                          item.id
                        }&isBillable=${1}`}
                      >
                        {item.billableHours}
                      </Link>
                    </TableCell>
                    <TableCell className="font-extrabold">
                      <Link
                        href={`/graphrecord/?startDate=${startDate}&endDate=${endDate}&projectId=${projectId}&userId=${
                          item.id
                        }&isBillable=${0}`}
                      >
                        {item.nonBillableHours}
                      </Link>
                    </TableCell>
                    <TableCell>{healthIcon}</TableCell>
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
    </>
  );
}
