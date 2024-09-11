import * as SolidIcons from "@heroicons/react/20/solid"
import * as OutlineIcons from "@heroicons/react/24/outline"

export type THeroIconName = keyof typeof SolidIcons | keyof typeof OutlineIcons

type ILayoutTitleType = "image" | "text" | "none"

type ILayoutTitleMap<T extends ILayoutTitleType> = T extends "image"
  ? { type: "image"; value?: string }
  : T extends "text"
    ? { type: "text"; value?: string }
    : { type: "none"; value?: null }

export type ILayoutTitle<T extends ILayoutTitleType> = ILayoutTitleMap<T>

export interface ILayoutDesktopBreadcrumb {
  component_name: string
}
export interface ILayoutDesktopSidebar {
  menus_name?: string
  profile?: boolean
  background?: ILayoutBackground
}

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
  icon?: THeroIconName
  button?: ILayoutButton
}

export interface ILayoutDesktopHeader {
  background?: ILayoutBackground
  title?: ILayoutTitle<"image" | "text" | "none">
  search?: boolean
  button?: ILayoutButton
  options?: {
    name: string
  }
}

export interface ILayoutMobileHeader {
  background?: ILayoutBackground
  title?: ILayoutTitle<"image" | "text" | "none">
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
