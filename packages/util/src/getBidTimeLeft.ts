const getBidTimeLeft = (endTime) => {
  const now = new Date().getTime()
  const end = new Date(endTime).getTime()
  const timeDiff = end - now

  const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
  const hoursLeft = Math.floor((timeDiff / (1000 * 60 * 60)) % 24)

  let timeDisplay: string
  let colorClass: string

  if (daysLeft > 2) {
    timeDisplay = `روز تا پایان ${daysLeft}`
    colorClass = "tag-success"
  } else if (daysLeft >= 1 && daysLeft <= 2) {
    timeDisplay = `روز تا پایان ${daysLeft}`
    colorClass = "tag-warning"
  } else if (daysLeft < 1 && hoursLeft > 0) {
    timeDisplay = `ساعت تا پایان ${hoursLeft}`
    colorClass = "tag-danger"
  } else {
    null
  }

  return { timeDisplay, colorClass }
}
export default getBidTimeLeft
