"use client"

import { PropsWithChildren } from "react"

const FiltersSidebarContainer: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className="bg-alpha-white p">{children}</div>
}

export default FiltersSidebarContainer
