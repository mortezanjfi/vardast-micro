import dynamicIconImports from "lucide-react/dynamicIconImports"
import colors from "tailwindcss/colors"

type TailwindShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900

export interface NavigationItemType {
  title: string
  path?: string
  icon?: keyof typeof dynamicIconImports
  abilities?: string
  role?: string
  items?: NavigationItemType[]
  color?: keyof typeof colors
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
