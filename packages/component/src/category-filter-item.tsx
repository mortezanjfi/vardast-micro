"use client"

import { Category } from "@vardast/graphql/generated"

import Link from "./Link"

interface CategoryFilterItemProps {
  category: Category
  slug?: Array<string | number>
}

const CategoryFilterItem = ({ category, slug }: CategoryFilterItemProps) => {
  return (
    <div className="flex items-center gap-1.5">
      <Link
        href={encodeURI(`/products/${category.id}/${category.title}`)}
        className={`flex items-center gap-1 py-2 text-alpha-700 hover:text-primary-500 ${
          slug && +slug[0] === category.id && "text-primary"
        }`}
      >
        {category.title}
      </Link>
    </div>
  )
}

export default CategoryFilterItem
