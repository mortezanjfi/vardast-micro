export const slugValidator = (str: string): boolean => {
  const p = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/
  if (!p.test(str)) return false
  return true
}
