import dynamicIconImports from "lucide-react/dynamicIconImports"

export interface NavigationItemType {
  title: string
  path?: string
  icon: keyof typeof dynamicIconImports
  abilities?: string
  role?: string
  items?: NavigationItemType[]
}

export interface NavigationType {
  title?: string
  abilities?: string
  role?: string
  items: NavigationItemType[]
}
