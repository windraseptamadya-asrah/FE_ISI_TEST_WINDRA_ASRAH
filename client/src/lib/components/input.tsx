import { ComponentPropsWithoutRef } from "react";
import { Control, Controller, FieldValues, Path, PathValue } from "react-hook-form";

type InputProps<T extends FieldValues = FieldValues> = ComponentPropsWithoutRef<"input"> & {
  control: Control<T>;
  name: Path<T>;
  defaultValue?: PathValue<T, Path<T>>;
};
export default function Input<T extends FieldValues = FieldValues>({
  control,
  name,
  defaultValue,
  ...props
}: InputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: props.required }}
      defaultValue={defaultValue}
      render={({ field }) => (
        <input
          {...field}
          {...props}
          value={field.value ?? ""}
          className={`rounded-sm border w-full border-neutral-500 outline-none px-2 py-1 ${props.className}`}
        />
      )}
    />
  );
}
