import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import DatePicker from "react-multi-date-picker"
import TimePicker from "react-multi-date-picker/plugins/time_picker"

const DatePickerMulti: any = ({ ...props }) => {
  return (
    <DatePicker
      className="vardast-calender"
      containerClassName="w-full"
      //   inputClass="w-full"
      //   inputClass="w-full border rounded-base h-40 px-base text-alpha-700 focus-visible:outline-none focus-visible:border-2 focus-visible:border-primary-500"
      calendar={persian}
      locale={persian_fa}
      format={"YYYY/MM/DD HH:mm"}
      plugins={[<TimePicker hideSeconds />]}
      {...props}
    />
  )
}

export default DatePickerMulti
