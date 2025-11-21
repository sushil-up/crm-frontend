import FormInput from "@/components/share/forminputs/FormInput";
import { Button, FormControl, Grid } from "@mui/material";
import React from "react";

export default function NotesForm({ notesEdit, control, errors }) {
  return (
    <>
      <FormInput
        className="shadow-lg relative "
        name="description"
        control={control}
        // placeholder="Notes..."
        label='Notes'
        errors={errors}
        multiline
        // rows={4}
      />
      <Grid item md={12} xs={12} className="pt-4 px-2">
        <FormControl fullWidth>
          <Button
            type="submit"
            className="!hover:bg-red-800 cursor-pointer w-24 bg-theme-red"
            variant="contained"
          >
            {notesEdit !== null ? "Update" : "Add"}
          </Button>
        </FormControl>
      </Grid>
    </>
  );
}
