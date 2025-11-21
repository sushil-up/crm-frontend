"use client";
import { useEffect, useState } from "react";
import { FormControl, FormHelperText, InputLabel } from "@mui/material";
import { Controller } from "react-hook-form";

export default function FormRichTextEditor({
  name,
  errors,
  control,
  label,
  className,
  defaultValue,
  placeholder,
  value,
}) {
  const [Editor, setEditor] = useState(null);

  useEffect(() => {
    // Dynamically import CKEditor on client
    import("@ckeditor/ckeditor5-react").then((mod) => {
      import("@ckeditor/ckeditor5-build-classic").then((classic) => {
        setEditor({ CKEditor: mod.CKEditor, ClassicEditor: classic.default });
      });
    });
  }, []);

  if (!Editor) return <p>Loading editor...</p>;

  return (
    <FormControl fullWidth className="textediotControl " >
      {label && (
        <InputLabel className="texteditoelable" shrink sx={{ mb: 1 }}>
          {label}
        </InputLabel>
      )}

      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue || ""}
        render={({ field }) => (
          <div
            className={className }

          >
            <Editor.CKEditor
              editor={Editor.ClassicEditor}
              data={value || field.value}
              config={{
                placeholder: placeholder || "",
              }}
              onChange={(_, editor) => {
                field.onChange(editor.getData());
              }}
            />
          </div>
        )}
      />

      {errors?.[name] && (
        <FormHelperText error>{errors[name].message}</FormHelperText>
      )}
    </FormControl>
  );
}
