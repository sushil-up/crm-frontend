"use client";
import React from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Typography,
  Tooltip,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import moment from "moment";
import { useRouter } from "next/navigation";
import { ActionButton } from "./ActionButton";
export default function DataGridPagination({
  descriptionHandler,
  hoursData,
  controller,
  currentUser,
  adminUser,
  totalRows,
  handleHoursDelete,
  handlePageChangePagination,
  handleChangeRowsPerPage,
  notesHandler,
}) {
  const router = useRouter();
  return (
    <>
      <Table className="mt-5">
        <TableHead className="hour-tablehead !bg-[#231f20]">
          <TableRow>
            <TableCell className="!p-4 bg-theme-color !text-white">
              Id
            </TableCell>
            <TableCell className="!p-4 bg-theme-color !text-white">
              Project Title
            </TableCell>
            <TableCell className="!p-4 bg-theme-color !text-white">
              Task Title
            </TableCell>

            <TableCell className="!p-4 bg-theme-color !text-white">
              Employee Name
            </TableCell>
            <TableCell className="!p-4 bg-theme-color !text-white">
              Description
            </TableCell>
            <TableCell className="!p-4 bg-theme-color !text-white">
              Hours By T.L
            </TableCell>
            <TableCell className="!p-4 bg-theme-color !text-white">
              Hours
            </TableCell>
            <TableCell className="!p-4 bg-theme-color !text-white">
              Date
            </TableCell>
            {/* {adminUser == "true" && <TableCell className="!p-4 bg-theme-color !text-white"> */}
            <TableCell className="!p-4 bg-theme-color !text-white">
              Action
            </TableCell>
            {/* </TableCell>} */}
          </TableRow>
        </TableHead>
        <TableBody>
          {hoursData?.length > 0 ? (
            hoursData.map((project, index) => (
              <TableRow key={index} className="p-2.5">
                <TableCell className="!p-4 !font-semibold">
                  {project?.id}
                </TableCell>

                <TableCell className="!p-4 capitalize">
                  <Tooltip
                    arrow
                    placement="top-start"
                    title={<span>{project.projectName}</span>}
                  >
                    <span>{`${project.projectName?.slice(0, 30)}`}</span>
                  </Tooltip>
                </TableCell>

                <TableCell className="!p-4 capitalize">
                  <Tooltip
                    arrow
                    placement="top-start"
                    title={<span>{project.taskName}</span>}
                  >
                    <span>{`${project.taskName?.slice(0, 30)}`}</span>
                  </Tooltip>
                </TableCell>

                <TableCell className="!p-4 capitalize">
                  {project.userName}
                </TableCell>

                <TableCell className="!p-4 capitalize">
                  {project?.description?.length ? (
                    <DescriptionIcon
                      className=" text-zinc-400 cursor-pointer "
                      onClick={() =>
                        descriptionHandler(
                          project?.description,
                          project?.createdAt,
                          project?.nonBillableReason
                        )
                      }
                    />
                  ) : (
                    "-"
                  )}
                </TableCell>

                <TableCell className="!p-4 capitalize">
                  {project.hoursByTL ?? "--"}
                </TableCell>

                <TableCell className="!p-4 capitalize">
                  {project.hours}
                </TableCell>

                <TableCell className="!p-4 capitalize">
                  {moment(project.date).format("YYYY-MM-DD")}
                </TableCell>

                <TableCell className="!p-4  ">
                  <ActionButton
                    project={project}
                    currentUser={currentUser}
                    adminUser={adminUser}
                    notesHandler={notesHandler}
                    handleHoursDelete={handleHoursDelete}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="9">
                <Typography className="text-red-500 text-center">
                  Data Not Found
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {totalRows !== undefined && (
        <TablePagination
          className="bg-white text-black custom-pagination"
          component="div"
          onPageChange={handlePageChangePagination}
          page={controller.page}
          count={totalRows}
          rowsPerPage={controller.rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}

      {/* project delete modal  */}
    </>
  );
}

// import React from 'react'
// import { DataGrid } from '@mui/x-data-grid';

// export default function DataGridPagination({
//   columns, data, totalRows, page, setPageSize, setPage
// }) {

//   const paginationHandler = (params) => {
//     setPage(params.page);
//     setPageSize(params.pageSize);
//   };

//   return (
//     <div className='my-6' style={{ width: "100%" }}>
//       <DataGrid
//         rows={data}
//         columns={columns}
//         pagination
//         rowCount={totalRows}
//         page={page}
//         onPaginationModelChange={paginationHandler}
//         paginationMode="server"
//         autosizeOptions={{
//           columns: ['name', 'status', 'createdBy'],
//           includeOutliers: true,
//           includeHeaders: false,
//         }}
//         initialState={{
//           ...data.initialState,
//           pagination: {
//             ...data.initialState?.pagination,
//             paginationModel: {
//               pageSize: 25,
//             },
//           },
//         }}
//       />
//     </div>
//   )
// }
