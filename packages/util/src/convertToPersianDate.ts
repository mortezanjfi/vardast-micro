function convertToPersianDate({
  dateString,
  withHour,
  withMinutes
}: {
  dateString: string
  withHour?: boolean
  withMinutes?: boolean
}): string {
  // Parse the input date string
  const date = new Date(dateString)

  // Create an instance of the Persian calendar
  const persianCalendar = new Intl.DateTimeFormat("fa", {
    calendar: "persian",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  })

  // Format the date using the Persian calendar
  const persianDate = persianCalendar.formatToParts(date)

  // Extract the Persian year, month, and day
  const persianYear = persianDate.find((part) => part.type === "year")!.value
  const persianMonth = persianDate.find((part) => part.type === "month")!.value
  const persianDay = persianDate.find((part) => part.type === "day")!.value
  const persianHour = persianDate.find((part) => part.type === "hour")!.value
  const persianMinutes = persianDate.find((part) => part.type === "hour")!.value

  // Assemble the Persian date in the 'yyyy/mm/dd' format
  const persianDateFormat = `${persianYear}/${persianMonth}/${persianDay}${
    withHour ? ` - ${persianHour}` : ""
  }${withMinutes ? `: ${persianMinutes}` : ""}`

  return persianDateFormat
}

export default convertToPersianDate
