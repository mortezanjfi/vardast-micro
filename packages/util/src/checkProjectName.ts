export enum EProjectName {
  ADMIN = "admin",
  SELLER = "seller",
  CLIENT = "client"
}

export const checkProjectName = (): EProjectName => {
  return process.env.NEXT_PUBLIC_PROJECT_NAME_FOR as EProjectName
}
