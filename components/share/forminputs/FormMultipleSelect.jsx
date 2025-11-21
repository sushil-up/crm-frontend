"use client";
import { InputLabel, MenuItem, Chip, Select, FormControl } from "@mui/material";
import { Controller } from "react-hook-form";

export default function MultipleSelectChip({
  control,
  label,
  name,
  data,
  defaultValue,
}) {
  const handleChange = (e, field) => {
    const value = e.target.value;
    const allOption = data.find(
      (option) => option.title.toLowerCase() === "all"
    );
    if (value.every((item) => item !== "") || value[0] === "") {
      const selectedValues = value.filter((val) => val !== allOption?.id);
      field.onChange(selectedValues);
    } else if (value[0] !== "") {
      field.onChange([allOption.id]);
    }
  };

  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <Select
            {...field}
            labelId="simple-select-label"
            id="simple-select"
            label={label}
            className="multiple-select-option search-inner"
            multiple
            onChange={(e) => handleChange(e, field)}
            renderValue={(selected) => {
              const allOption = data.find(
                (option) => option.title.toLowerCase() === "all"
              );

              if (allOption && selected.includes(allOption.id)) {
                return <Chip key="all" label="All" className="mr-1" />;
              }

              return (
                <div>
                  {selected.map((value) => {
                    const options = data.find((p) => p.id === value);
                    return (
                      <Chip
                        size="small"
                        sx={{ margin: "5px" }}
                        key={value}
                        label={options ? options.title : ""}
                        className="mr-1"
                      />
                    );
                  })}
                </div>
              );
            }}
          >
            {data.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.title}
              </MenuItem>
            ))}
          </Select>
        )}
      />
    </FormControl>
  );
}
