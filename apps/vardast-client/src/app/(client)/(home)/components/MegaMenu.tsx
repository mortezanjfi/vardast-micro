import { useEffect, useState } from "react"
import { UseQueryResult } from "@tanstack/react-query"
import { GetMegaMenuQuery } from "@vardast/graphql/src/generated"
import clsx from "clsx"
import { ChevronLeft, Menu, SettingsIcon } from "lucide-react"

type Props = { megaMenuData: UseQueryResult<GetMegaMenuQuery, unknown> }

export const MegaMenuLoader = () => {
  return (
    <div className="flex items-center gap-4 py-4">
      <Menu width={18} height={18} className="animated-card" />
      <div className="flex gap-1">
        <span className="animated-card h-5 w-36" />
        <span className="animated-card h-5 w-10" />
      </div>
    </div>
  )
}

const MegaMenu = ({ megaMenuData }: Props) => {
  const [activeCategory, setActiveCategory] = useState(
    megaMenuData?.data?.mega_menu[0]
  )

  useEffect(() => {
    setActiveCategory(megaMenuData?.data?.mega_menu[0])
  }, [megaMenuData])

  return (
    <div className="group  inline-flex  items-center gap-4  py-4 text-base text-alpha-800 hover:text-gray-700">
      <Menu width={18} height={18} />
      دسته بندی کالا
      <div className="absolute top-full z-50 hidden  max-h-[calc(100vh-300px)] w-[calc(100%-40px)]  grid-cols-5 overflow-hidden rounded-b-2xl bg-white text-gray-900 shadow-lg hover:grid group-hover:grid">
        {/* Category Sidebar */}
        <div className="col-span-1  max-h-[calc(100vh-300px)] overflow-y-auto  bg-alpha-100 py-5">
          {megaMenuData?.data?.mega_menu?.map((category) => (
            <div
              key={category.id}
              onMouseEnter={() => setActiveCategory(category)}
              className={clsx(
                "flex cursor-pointer items-center gap-3 px-4 py-4 hover:bg-alpha-50",
                category?.id == activeCategory?.id && "text-primary"
              )}
            >
              <SettingsIcon width={20} height={20} className="text-alpha-800" />
              {category.title}
            </div>
          ))}
        </div>

        {/* Subcategory Content */}
        <div className="col-span-4  max-h-[calc(100vh-300px)]">
          {activeCategory ? (
            <div className="flex max-h-[calc(100vh-300px)] flex-col divide-y-0.5  overflow-hidden">
              <div className="flex items-center gap-4 px-7 py-5  text-blue-600">
                <h3 className="text-base font-medium">
                  {activeCategory.title}
                </h3>
                <ChevronLeft width={16} height={16} />
              </div>
              <div className="grid max-h-[calc(100vh-300px)] grid-cols-4 gap-7 overflow-y-auto  px-7 py-5 ">
                {activeCategory.children.map((subcategory) => (
                  <div className="flex flex-col gap-3" key={subcategory.id}>
                    <div className="flex items-center gap-4 border-r-1 border-primary py-2 pr-3">
                      <span className="">{subcategory.title}</span>
                      <ChevronLeft width={16} height={16} />
                    </div>
                    <ul className="pr-3">
                      {subcategory.children.map((subSubcategory) => (
                        <li
                          key={subSubcategory.id}
                          className="py-2 text-alpha-500"
                        >
                          {subSubcategory.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-gray-500">
              Hover over a category to see subcategories
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MegaMenu
