"use client";
import { Button, Grid } from "@mui/material";
import FormDatePickerRange from "@/components/share/forminputs/FormDatePickerRange";
export default function DashboardDateFilter({
  rhfSetValue,
  startDefaultDate,
  endDefaultDate, 
}) {
  return (
    <>
     <div  className="serachbar-background search-outer secrch-wrp">
     <Grid className="grid grid-cols-2 gap-24 !mt-5 !pt-0 !ml-0 !pr-4 !mb-4" >
        <Grid >
          <FormDatePickerRange
            rhfSetValue={rhfSetValue}
            defaultStartDate={startDefaultDate}
            defaultEndDate={endDefaultDate}
          />
        </Grid>
        <Grid  >
          <Button
            className="w-96 h-full bg-theme-red !text-white !rounded-full !border-none font-semibold"
            variant="outlined"
            position="fixed"
            type="submit"
          >
            Search
          </Button>
        </Grid>
      </Grid>
     </div>
    </>
  );
}
