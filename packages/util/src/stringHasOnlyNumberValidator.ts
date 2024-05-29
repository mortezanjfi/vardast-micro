export const stringHasOnlyNumberValidator = (str: string): boolean => {
  const p = /^\d+$/
  if (!p.test(str)) return false
  return true
}
