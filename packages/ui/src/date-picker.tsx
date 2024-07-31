import React from "react"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import DatePickerPackage, {
  CalendarProps,
  DatePickerProps
} from "react-multi-date-picker"
import TimePicker from "react-multi-date-picker/plugins/time_picker"

const DatePicker = <
  Multiple extends boolean = false,
  Range extends boolean = false
>(
  props: Omit<CalendarProps<Multiple, Range>, "onChange"> &
    DatePickerProps<Multiple, Range>
): React.ReactElement => {
  return (
    <DatePickerPackage
      className="vardast-calender"
      containerClassName="w-full"
      arrow={false}
      offsetY={4}
      calendar={persian}
      locale={persian_fa}
      format={"YYYY/MM/DD HH:mm"}
      plugins={[<TimePicker hideSeconds />]}
      {...props}
    />
  )
}

export default DatePicker
