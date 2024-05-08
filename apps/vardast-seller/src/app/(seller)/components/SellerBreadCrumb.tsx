"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { HomeIcon } from "@heroicons/react/24/outline"
import Link from "@vardast/component/Link"
import useTranslation from "next-translate/useTranslation"

// import useTranslation from "next-translate/useTranslation"

export interface CrumbItemProps {
  label: string
  path: string
  isCurrent: boolean
}

interface SelllerBreadcrumbProps {
  dynamic?: boolean
  items?: CrumbItemProps[]
}

const SelllerBreadcrumb = ({
  items,
  dynamic = true
}: SelllerBreadcrumbProps) => {
  const { t } = useTranslation()
  const pathname = usePathname()
  const [breadcrumbs, setBreadcrumbs] = useState<CrumbItemProps[]>()

  useEffect(() => {
    let tempBreadcrumbs

    if (dynamic) {
      const pathWithoutQuery = pathname.split("?")[0]
      let pathArray = pathWithoutQuery.split("/")
      pathArray.shift()

      pathArray = pathArray.filter((path) => path !== "")

      tempBreadcrumbs = pathArray.map((path, index) => {
        const href = "/" + pathArray.slice(0, index + 1).join("/")
        return {
          path: href,
          label: path,
          isCurrent: index === pathArray.length - 1
        }
      })
    } else {
      tempBreadcrumbs = items
    }

    setBreadcrumbs(tempBreadcrumbs)
  }, [pathname, dynamic, items])

  return (
    <div role="presentation">
      <ol
        className="hide-scrollbar flex items-end gap-1 overflow-y-auto whitespace-nowrap px py-6 pr align-middle text-sm leading-none"
        aria-label="breadcrumb"
      >
        <HomeIcon className="h-4 w-4" />
        <li className="flex items-end align-middle leading-none">
          <Link href="/" aria-current={pathname === "/" ? "page" : "false"}>
            <div
              title={process.env.NEXT_PUBLIC_TITLE}
              className="text-alpha-600"
            >
              خانه
            </div>
          </Link>
        </li>
        {breadcrumbs &&
          breadcrumbs.map((crumb, idx) => (
            <li key={idx} className="flex items-end align-middle leading-none">
              {/* {(idx !== breadcrumbs.length && idx > 0) ||
                (pathname.split("/")[1] === "admin" && ( */}
              {idx !== breadcrumbs.length && crumb.label !== "all-products" && (
                <span className="mx-1 text-alpha-400">/</span>
              )}
              <Link href={crumb.path} passHref prefetch={false}>
                <div
                  title={crumb.label}
                  aria-current={crumb.isCurrent ? "page" : "false"}
                  className={
                    idx < breadcrumbs.length - 1
                      ? "text-alpha-600"
                      : "text-primary"
                  }
                >
                  {crumb.label !== "all-products" && t(`common:${crumb.label}`)}
                </div>
              </Link>
            </li>
          ))}
      </ol>
    </div>
  )
}

export default SelllerBreadcrumb
