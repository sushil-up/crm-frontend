import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Controller } from "react-hook-form";

const FormInputSelect = ({
  name,
  control,
  label,
  placeholder,
  options,
  errors,
  defaultValue,
  disable = ""
}) => {
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Controller
        name={name}
        control={control}
        placeholder={placeholder}
        defaultValue={defaultValue || ""} // Updated defaultValue handling
        render={({ field }) => (
          <Select
            label={label}
            id={name}
            placeholder={placeholder}
            disabled ={disable}
            {...field}
            error={!!errors?.[name]}
            className="search-inner input-field !text-[#9F9F9F]"
          >
               <MenuItem value="" disabled>
              {placeholder || label || "Select..."}
            </MenuItem>
            {options?.map((option) => (
              <MenuItem
                className="capitalize"
                key={option.value}
                value={option.value}
                placeholder={placeholder}
              >
                {option.label}
              </MenuItem>
            ))}
          </Select>
        )}
      />

      {errors?.[name] && (
        <p className="text-red-600 text-xs">{errors[name]?.message}</p>
      )}
    </FormControl>
  );
};

export default FormInputSelect;
