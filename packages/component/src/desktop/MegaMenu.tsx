"use client"

import { useContext, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { UseQueryResult } from "@tanstack/react-query"
import {
  CategoryDto,
  GetMegaMenuQuery,
  useGetMegaMenuQuery
} from "@vardast/graphql/generated"
import { PublicContext } from "@vardast/provider/PublicProvider"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion"
import { useAtom } from "jotai"
import { ChevronLeft } from "lucide-react"

import DynamicHeroIcon from "../DynamicHeroIcon"
import Link from "../Link"

export const MegaMenuLoader = () => {
  return (
    <div className="flex items-center gap-4 py-3">
      <DynamicHeroIcon
        className="animated-card h-6 w-6"
        icon="Squares2X2Icon"
      />
      <div className="flex gap-1">
        <span className="animated-card h-5 w-20" />
        <span className="animated-card h-5 w-5" />
      </div>
    </div>
  )
}

type MenuProps = {
  megaMenuData: UseQueryResult<GetMegaMenuQuery, unknown>
  handleMouseEnterList: () => void
  handleMouseLeaveContainer: () => void
}

const MegaMenu = () => {
  const { globalMegaMenuAtom } = useContext(PublicContext)
  const [open, setOpen] = useAtom(globalMegaMenuAtom)
  const megaMenuData = useGetMegaMenuQuery(graphqlRequestClientWithToken)
  const menuTimeoutRef = useRef(null)

  const handleMouseEnter = () => {
    clearTimeout(menuTimeoutRef.current)
    setOpen(true)
  }

  const handleMouseLeaveContainer = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setOpen(false)
    }, 100)
  }

  const handleMouseEnterList = () => {
    clearTimeout(menuTimeoutRef.current)
  }

  return (
    <>
      {megaMenuData.isLoading || megaMenuData.isFetching ? (
        <MegaMenuLoader />
      ) : (
        <div
          className={clsx(
            "relative flex flex-col items-center gap-3 text-base text-alpha-800 hover:text-gray-700"
          )}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeaveContainer}
        >
          <div
            className={clsx(
              "flex items-center gap-3 whitespace-nowrap pb-1 pt-4",
              open && "z-50"
            )}
          >
            <DynamicHeroIcon className="h-6 w-6" icon="Squares2X2Icon" />
            <span className="font-medium">دسته‌بندی کالاها</span>
          </div>
        </div>
      )}
      <MegaMenuModal
        handleMouseEnterList={handleMouseEnterList}
        handleMouseLeaveContainer={handleMouseLeaveContainer}
        megaMenuData={megaMenuData}
      />
    </>
  )
}

export const MegaMenuModal = ({
  megaMenuData,
  handleMouseEnterList,
  handleMouseLeaveContainer
}: MenuProps) => {
  const { globalMegaMenuAtom } = useContext(PublicContext)
  const [open, setOpen] = useAtom(globalMegaMenuAtom)
  const [activeCategory, setActiveCategory] = useState(
    megaMenuData?.data?.mega_menu[0]
  )
  useEffect(() => {
    setActiveCategory(megaMenuData?.data?.mega_menu[0])
  }, [megaMenuData])

  const divideIntoColumns = (array: CategoryDto[], numColumns: number) => {
    const columns = Array.from({ length: numColumns }, () => [])
    array?.forEach((item, index) => {
      columns[index % numColumns].push(item)
    })
    return columns
  }

  const columns = divideIntoColumns(activeCategory?.children, 3)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className={clsx([
            open ? "z-[99]" : "",
            open ? "mx-auto md:max-w-md lg:max-w-lg" : ""
          ])}
          exit={{ opacity: 0, y: 0 }}
          initial={{ opacity: 0, y: 0 }}
          key="mega-menu-modal"
        >
          {" "}
          <div
            className={clsx([
              "fixed inset-0 z-20 h-full w-full bg-alpha-800 transition duration-200",
              open ? "visible opacity-50" : "invisible hidden opacity-0"
            ])}
          ></div>
          <div
            className="absolute  top-full z-50 flex  max-h-[calc(100vh-300px)] w-[calc(100%-400px)]  overflow-hidden rounded-2xl bg-white text-gray-900 shadow-lg 2xl:grid-cols-5"
            onMouseEnter={handleMouseEnterList}
            onMouseLeave={handleMouseLeaveContainer}
          >
            {/* Category Sidebar */}
            <div className="col-span-1 max-h-[calc(100vh-300px)] min-w-max max-w-xs overflow-y-auto bg-alpha-100 py-5">
              {megaMenuData?.data?.mega_menu?.map((category) => (
                <Link
                  className={clsx(
                    "flex cursor-pointer items-center gap-3 px-4 py-4 hover:bg-alpha-50",
                    category?.id === activeCategory?.id && "text-primary"
                  )}
                  href={`/category/${category?.id}/${category.title}`}
                  key={category.id}
                  onClick={() => setOpen(false)}
                  onMouseEnter={() => setActiveCategory(category)}
                >
                  <Image
                    alt="main-categories"
                    height={24}
                    src={category?.image_url}
                    width={24}
                  />
                  {category.title}
                </Link>
              ))}
            </div>

            {/* Subcategory Content */}
            <div className=" max-h-[calc(100vh-300px)] flex-1">
              {activeCategory && (
                <div className="flex max-h-[calc(100vh-300px)] flex-col overflow-hidden">
                  <Link
                    className="flex items-center gap-4 px-7 py-5 text-blue-600"
                    href={`/category/${activeCategory?.id}/${activeCategory.title}`}
                  >
                    <h3 className="text-base font-medium">
                      {activeCategory.title}
                    </h3>
                    <ChevronLeft height={16} width={16} />
                  </Link>
                  <div className="flex max-h-[calc(100vh-300px)] max-w-full overflow-y-auto px-7 py-5">
                    {columns.map((column, columnIndex) => (
                      <div
                        className="flex flex-1 flex-col gap-3 "
                        key={columnIndex}
                      >
                        {column.map((subcategory) => (
                          <div
                            className="flex flex-col gap-3"
                            key={subcategory.id}
                          >
                            <Link
                              className="flex items-center gap-4 border-r-1 border-primary py-2 pr-3"
                              href={`/category/${subcategory?.id}/${subcategory.title}`}
                              onClick={() => setOpen(false)}
                            >
                              <span className="hover:text-primary">
                                {subcategory.title}
                              </span>
                              <ChevronLeft height={16} width={16} />
                            </Link>
                            <ul className="pr-3">
                              {subcategory.children.map((subSubcategory) => (
                                <Link
                                  href={`/category/${subSubcategory?.id}/${subSubcategory.title}`}
                                  key={subSubcategory.id}
                                  onClick={() => setOpen(false)}
                                >
                                  <li className="py-2 text-alpha-500 hover:text-primary">
                                    {subSubcategory.title}
                                  </li>
                                </Link>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MegaMenu
