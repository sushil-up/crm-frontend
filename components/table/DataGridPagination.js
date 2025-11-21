import React from 'react'
import { DataGrid } from '@mui/x-data-grid';

export default function DataGridPaginationOld({
  columns, data, totalRows, page, setPageSize, setPage
}) {

  const paginationHandler = (params) => {
    setPage(params.page);
    setPageSize(params.pageSize);
  };

  return (
    <div className='my-6' style={{ width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns}
        pagination
        rowCount={totalRows}
        page={page}
        onPaginationModelChange={paginationHandler}
        paginationMode="server"
        autosizeOptions={{
          columns: ['name', 'status', 'createdBy'],
          includeOutliers: true,
          includeHeaders: false,
        }}
        initialState={{
          ...data.initialState,
          pagination: {
            ...data.initialState?.pagination,
            paginationModel: {
              pageSize: 25,
            },
          },
        }}
      />
    </div>
  )
}
