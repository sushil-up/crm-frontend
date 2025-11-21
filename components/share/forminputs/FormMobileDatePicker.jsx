import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FormControl, InputAdornment } from "@mui/material";
import dayjs from "dayjs";
const FormMobileDatePicker = ({
  name,
  control,
  label,
  inputFormat,
  defaultValue,
  errors,
  value,
  className,
}) => {
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  return (
    <>
      <div>
        <FormControl fullWidth>
          <Controller
            name={name}
            control={control}
            value={value}
            defaultValue={defaultValue}
            render={({ field: { onChange, value } }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDatePicker
                  inputFormat={inputFormat}
                  label={label}
                  open={isDatePickerOpen}
                  onClose={() => setDatePickerOpen(false)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <DateRangeIcon
                          className="cursor-pointer"
                          onClick={() => setDatePickerOpen(!isDatePickerOpen)}
                        />
                      </InputAdornment>
                    ),
                  }}
                  value={value ? value : null}
                  onChange={(newValue) => {
                    onChange(newValue || value);
                    setDatePickerOpen(false); // Close the calendar after selecting a date
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      // defaultValue={dayjs(new Date())}
                      error={!!errors?.[name]}
                      helperText={errors?.[name]?.message}
                      className={`${className} input-field !text-[#9F9F9F]`}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            )}
          />
        </FormControl>
      </div>
    </>
  );
};
export default FormMobileDatePicker;
