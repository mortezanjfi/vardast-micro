import { LucideIcon } from "lucide-react"
import dynamicIconImports from "lucide-react/dynamicIconImports"

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

export interface ILayoutOption {
  id: number
  title: string
  icon?: keyof typeof dynamicIconImports
  IconPrerender?: LucideIcon
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
  progress?: boolean
  hamburger?: boolean
  options?: {
    name: string
  }
}

export type WithNavigationRouteItem = {
  forceEqual: boolean
  path: string
  dynamicRouteAllow?: boolean
}
export interface ILayoutDesktopFooter {
  background?: ILayoutBackground
}
export interface ILayoutMobileFooter {
  background?: ILayoutBackground
  search?: boolean
  back?: boolean | WithNavigationRouteItem[]
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
  breadcrumb?: boolean

  footer?: ILayoutDesktopFooter
  main?: ILayoutDesktopMain
}
export interface ILayoutMobile {
  background?: ILayoutBackground
  header?: ILayoutMobileHeader
  footer?: ILayoutMobileFooter
  sidebar?: ILayoutDesktopSidebar

  main?: ILayoutMobileMain
}

export interface ILayoutProps {
  mobile?: ILayoutMobile
  desktop?: ILayoutDesktop
}
