declare module "*.svg" {
  const content: string | import("../shared/lib/get-img-props").StaticImport
  export default content
}
declare module "*.png" {
  const value: string
  export default value
}
declare module "*.gif" {
  const value: string
  export default value
}
