"use client";
import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";

const CommonTable = ({
  data,
  column,
  handleChangeRowsPerPage,
  controller,
  userCount,
  handlePageChange,
}) => {
  return (
    <>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 650 }}
          aria-label="simple table"
          className="table-fixed"
        >
          <TableHead className="!bg-[#231f20]">
            <TableRow>
              {column.map((col, index) => (
                <TableCell key={index} className="!p-4  !text-white">
                  {col.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {column.map((col, colIndex) => (
                  <TableCell key={colIndex}>
                    {col.cell ? col.cell(row) : row[col.accessorkey]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        className="!bg-white !text-black custom-pagination"
        component="div"
        onPageChange={handlePageChange}
        page={controller.page}
        count={userCount}
        rowsPerPage={controller.rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default CommonTable;
