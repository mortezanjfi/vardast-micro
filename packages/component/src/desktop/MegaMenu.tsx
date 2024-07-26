"use client"

import { useContext, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { UseQueryResult } from "@tanstack/react-query"
import {
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
        className="animated-card h-4 w-4"
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
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeaveContainer}
          className={clsx(
            "relative flex flex-col items-center gap-3 text-base text-alpha-800 hover:text-gray-700"
          )}
        >
          <div
            className={clsx("flex items-center gap-3  py-4", open && "z-50")}
          >
            <DynamicHeroIcon className="h-4 w-4" icon="Squares2X2Icon" />
            <span className="font-medium">دسته‌بندی کالاها</span>
          </div>
        </div>
      )}
      <MegaMenuModal
        megaMenuData={megaMenuData}
        handleMouseEnterList={handleMouseEnterList}
        handleMouseLeaveContainer={handleMouseLeaveContainer}
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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mega-menu-modal"
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 0 }}
          className={clsx([
            open ? "z-[99]" : "",
            open ? "mx-auto md:max-w-md lg:max-w-lg" : ""
          ])}
        >
          {" "}
          <div
            className={clsx([
              "fixed inset-0 z-20 h-full w-full bg-alpha-800 transition duration-200",
              open ? "visible opacity-50" : "invisible hidden opacity-0"
            ])}
          ></div>
          <div
            onMouseEnter={handleMouseEnterList}
            onMouseLeave={handleMouseLeaveContainer}
            className="absolute  top-full z-50 grid max-h-[calc(100vh-300px)] w-[calc(100%-400px)] grid-cols-3 overflow-hidden rounded-b-2xl bg-white text-gray-900 shadow-lg 2xl:grid-cols-5"
          >
            {/* Category Sidebar */}
            <div className="col-span-1 max-h-[calc(100vh-300px)] overflow-y-auto bg-alpha-100 py-5">
              {megaMenuData?.data?.mega_menu?.map((category) => (
                <Link
                  onClick={() => setOpen(false)}
                  href={`/category/${category?.id}`}
                  key={category.id}
                  onMouseEnter={() => setActiveCategory(category)}
                  className={clsx(
                    "flex cursor-pointer items-center gap-3 px-4 py-4 hover:bg-alpha-50",
                    category?.id === activeCategory?.id && "text-primary"
                  )}
                >
                  <Image
                    src={category?.image_url}
                    width={20}
                    height={20}
                    alt="main-categories"
                  />
                  {category.title}
                </Link>
              ))}
            </div>

            {/* Subcategory Content */}
            <div className="col-span-2 max-h-[calc(100vh-300px)] 2xl:col-span-4">
              {activeCategory ? (
                <div className="flex max-h-[calc(100vh-300px)] flex-col divide-y-0.5 overflow-hidden">
                  <div className="flex items-center gap-4 px-7 py-5 text-blue-600">
                    <h3 className="text-base font-medium">
                      {activeCategory.title}
                    </h3>
                    <ChevronLeft width={16} height={16} />
                  </div>
                  <div className="grid max-h-[calc(100vh-300px)] grid-cols-3 gap-7 overflow-y-auto px-7 py-5 2xl:grid-cols-4">
                    {activeCategory.children.map((subcategory) => (
                      <div className="flex flex-col gap-3" key={subcategory.id}>
                        <Link
                          onClick={() => setOpen(false)}
                          href={`/category/${subcategory?.id}`}
                          className="flex items-center gap-4 border-r-1 border-primary py-2 pr-3"
                        >
                          <span className="">{subcategory.title}</span>
                          <ChevronLeft width={16} height={16} />
                        </Link>
                        <ul className="pr-3">
                          {subcategory.children.map((subSubcategory) => (
                            <Link
                              onClick={() => setOpen(false)}
                              href={`/category/${subSubcategory?.id}`}
                            >
                              <li
                                key={subSubcategory.id}
                                className="py-2 text-alpha-500"
                              >
                                {subSubcategory.title}
                              </li>
                            </Link>
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
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MegaMenu
