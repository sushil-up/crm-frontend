"use client";
import React, { useState } from "react";
import Rating from "@mui/material/Rating";
import { FormHelperText, Typography } from "@mui/material";
import { Controller } from "react-hook-form";

const RatingItems = ({
  name,
  label,
  control,
  errors,
  className,
  handleRating,
}) => {
  return (
    <>
      <Controller
        name={name}
        label={label}
        control={control}
        render={({ field }) => {
          return (
            <>
              <Typography component="legend">{label}</Typography>
              <Rating
                onClick={handleRating}
                className={className}
                type="number"
                max={10}
                name={name}
                {...field}
                onChange={(event, newValue) => field.onChange(newValue)}
                value={field.value || 0}
              />
              {errors?.[name] && (
                <FormHelperText className="text-red-600">
                  {errors[name]?.message}
                </FormHelperText>
              )}
            </>
          );
        }}
      />
    </>
  );
};

export default RatingItems;
