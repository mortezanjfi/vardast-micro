"use client"

import { LucideLoader2 } from "lucide-react"

export type ICategoryListLoader = null | number

const CategoryListLoader = () => {
  return (
    <div className="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-alpha-800 bg-opacity-20 text-primary-600">
      <span className="animate-spin">
        <LucideLoader2 className="h-8 w-8" />
      </span>
    </div>
  )
}

export default CategoryListLoader
