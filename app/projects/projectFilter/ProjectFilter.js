import { Button, Grid } from "@mui/material";
import React from "react";
import { projectFilterstatusOptions } from "@/components/selectOptions/selectOptionObject";
import FormInputSelect from "@/components/share/forminputs/FormInputSelect";
export default function ProjectFilter({ control, filters }) {
  return (
    <div className="serachbar-background search-outer">
      <Grid className="grid grid-cols-2 gap-24 !mt-5 !pt-0 !ml-0 !pr-4 !mb-4" >
 
        <Grid >
          <FormInputSelect
            name="status"
            label="Project Status"
            options={projectFilterstatusOptions}
            defaultValue={filters.status}
            control={control}
          />
        </Grid>
       
        <Grid >
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
  );
}
