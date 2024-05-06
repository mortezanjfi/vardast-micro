export const checkSellerRedirectUrl = (url: string): string => {
  if (process.env.NEXT_PUBLIC_PROJECT_NAME_FOR === "seller") {
    return `${process.env.NEXT_PUBLIC_VARDAST}${url}`
  }
  return url
}
