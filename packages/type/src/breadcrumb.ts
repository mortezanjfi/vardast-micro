export interface CrumbItemProps {
  label: string
  path: string
  isCurrent: boolean
}
export interface BreadcrumbProps {
  dynamic?: boolean
  items?: CrumbItemProps[]
}
