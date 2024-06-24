import colors from "tailwindcss/colors"

import { THeroIconName } from "./layout"

type TailwindShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900

export interface NavigationItemType {
  title: string
  path?: string
  icon?: THeroIconName
  abilities?: string
  role?: string
  items?: NavigationItemType[]
  color?:
    | `text-${keyof typeof colors}-${TailwindShade}`
    | `text-${keyof typeof colors}`
  background_color?:
    | `bg-${keyof typeof colors}-${TailwindShade}`
    | `bg-${keyof typeof colors}`
}

export interface NavigationType {
  title?: string
  abilities?: string
  role?: string
  items: NavigationItemType[]
}
