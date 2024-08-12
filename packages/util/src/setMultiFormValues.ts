import { FieldPath, PathValue, UseFormSetValue } from "react-hook-form"

export const setMultiFormValues = <TFieldValues>(
  data: Partial<TFieldValues>,
  setValue: UseFormSetValue<TFieldValues>
) => {
  if (!data) {
    return
  }
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      setValue(
        key as FieldPath<TFieldValues>,
        value as PathValue<TFieldValues, FieldPath<TFieldValues>>
      )
    }
  })
}
