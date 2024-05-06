import { ColorEnum } from "./Enums"

export type ISellerMobileAnalyzeProps = {
  Icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
      title?: string | undefined
      titleId?: string | undefined
    } & React.RefAttributes<SVGSVGElement>
  >
  title: string
  value?: string | number | null
  id: string
  href?: string
  bgColor?: ColorEnum
  isMobileView?: boolean
}

type ISellerAnalzeCardListItems = {
  listText: string
  href?: string
  id: string
}
export type ISellerDesktopAnalyzeProps = {
  id: string
  title: string
  Icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
      title?: string | undefined
      titleId?: string | undefined
    } & React.RefAttributes<SVGSVGElement>
  >
  listItems: ISellerAnalzeCardListItems[]
  option?: string
}
