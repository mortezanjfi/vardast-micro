export const checkBooleanByString = (str: string) => {
  if (str.toLowerCase() === "false") {
    return false
  }
  if (str.toLowerCase() === "true") {
    return true
  }
}
