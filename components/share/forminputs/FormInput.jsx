import { FormControl } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";

export default function FormInput({
  name,
  errors,
  control,
  label,
  inputType,
  className,
  defaultValue,
  placeholder,
  value,
  rows,
  multiline,
}) {
  return (
    <FormControl fullWidth>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue ? defaultValue : ""}
        render={({ field }) => {
          return (
            <TextField
              InputLabelProps={{ shrink: true }}
              {...field}
              className={`${className} input-field !text-[#9F9F9F] `}
              fullWidth
              value={value ? value : field.value}
              label={label}
              placeholder={placeholder}
              type={inputType}
              error={!!errors?.[name]}
              helperText={errors?.[name]?.message}
              multiline={multiline}
              rows={rows}
              variant="outlined"
            />
          );
        }}
      />
    </FormControl>
  );
}
