export const AUTHENTICATION_BASE_PATH = "/auth"
export const getReturnedUrl = (pathname: string) =>
  pathname
    .replace(`${AUTHENTICATION_BASE_PATH}/signin`, "")
    .split("/")
    .filter(Boolean)
    .join("/") || "/"
