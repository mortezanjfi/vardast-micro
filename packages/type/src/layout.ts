import { LucideIcon } from "lucide-react"

type ILayoutTitleType = "image" | "text"

type ILayoutTitleMap<T extends ILayoutTitleType> = T extends "image"
  ? { type: "image"; value?: string }
  : { type: "text"; value?: string }

export interface ILayoutDesktopBreadcrumb {
  component_name: string
}
export interface ILayoutDesktopSidebar {
  menus_name?: string
  profile?: boolean
  background?: ILayoutBackground
}

export type ILayoutTitle<T extends ILayoutTitleType> = ILayoutTitleMap<T>

interface ILayoutButton {
  type: "click" | "link"
  value: string | (() => void)
}

type ILayoutBackground = {
  type: "color" | "image"
  value: string
}

interface ILayoutIcon {
  Default: LucideIcon
  Active: LucideIcon
}

export interface ILayoutOption {
  id: number
  title: string
  icon?: ILayoutIcon
  button?: ILayoutButton
}

export interface ILayoutDesktopHeader {
  background?: ILayoutBackground
  title?: ILayoutTitle<"image" | "text">
  search?: boolean
  button?: ILayoutButton
  options?: {
    name: string
  }
}

export interface ILayoutMobileHeader {
  background?: ILayoutBackground
  title?: ILayoutTitle<"image" | "text">
  back?: boolean
  options?: {
    name: string
  }
}
export interface ILayoutDesktopFooter {
  background?: ILayoutBackground
}
export interface ILayoutMobileFooter {
  background?: ILayoutBackground
  search?: boolean
  back?: boolean
  action?: boolean
  options?: {
    name: string
  }
}

export interface ILayoutMobileMain {
  background?: ILayoutBackground
  breadcrumb?: boolean
  page_header?: boolean
}

export interface ILayoutDesktopMain {
  container?: boolean
  background?: ILayoutBackground
  breadcrumb?: boolean
  page_header?: boolean
}
export interface ILayoutDesktop {
  background?: ILayoutBackground
  header?: ILayoutDesktopHeader
  sidebar?: ILayoutDesktopSidebar
  footer?: ILayoutDesktopFooter
  main?: ILayoutDesktopMain
}
export interface ILayoutMobile {
  background?: ILayoutBackground
  header?: ILayoutMobileHeader
  footer?: ILayoutMobileFooter
  main?: ILayoutMobileMain
}

export interface ILayoutProps {
  mobile?: ILayoutMobile
  desktop?: ILayoutDesktop
}
