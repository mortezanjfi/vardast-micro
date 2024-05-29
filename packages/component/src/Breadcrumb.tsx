"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { HomeIcon } from "@heroicons/react/24/outline"
import { stringHasOnlyNumberValidator } from "@vardast/util/stringHasOnlyNumberValidator"
import useTranslation from "next-translate/useTranslation"

import Link from "./Link"

export interface CrumbItemProps {
  label: string
  path: string
  isCurrent: boolean
}

interface BreadcrumbProps {
  dynamic?: boolean
  items?: CrumbItemProps[]
  isMobileView?: boolean
}

const Breadcrumb = ({
  items,
  dynamic = true,
  isMobileView
}: BreadcrumbProps) => {
  const pathname = usePathname()
  const [breadcrumbs, setBreadcrumbs] = useState<CrumbItemProps[]>()
  const { t } = useTranslation()
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
          label: stringHasOnlyNumberValidator(path)
            ? t(`common:details`)
            : +path > 0
              ? path
              : t(`common:${path}`),
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
        className="hide-scrollbar flex items-end gap-1 overflow-y-auto whitespace-nowrap border-b px py-4 pr align-middle text-sm leading-none sm:border-b-0 sm:px-0 sm:py-8"
        aria-label="breadcrumb"
      >
        <Link href="/" aria-current={pathname === "/" ? "page" : "false"}>
          <HomeIcon className="h-4 w-4" />
        </Link>
        {/* {pathname.split("/")[1] === "admin" && ( */}
        {!isMobileView ? (
          <li className="flex items-end align-middle leading-none">
            <Link href="/" aria-current={pathname === "/" ? "page" : "false"}>
              <div
                title={process.env.NEXT_PUBLIC_TITLE}
                className="text-alpha-600"
              >
                وردست
              </div>
            </Link>
          </li>
        ) : null}
        {/* )} */}
        {breadcrumbs &&
          breadcrumbs.map((crumb, idx) => (
            <li key={idx} className="flex items-end align-middle leading-none">
              {/* {(idx !== breadcrumbs.length && idx > 0) ||
                (pathname.split("/")[1] === "admin" && ( */}
              {idx !== breadcrumbs.length && (
                <span className="mx-1 text-alpha-400">/</span>
              )}
              <Link href={crumb.path} passHref>
                <div
                  title={crumb.label}
                  aria-current={crumb.isCurrent ? "page" : "false"}
                  className={
                    idx < breadcrumbs.length - 1
                      ? "text-alpha-600"
                      : "text-primary"
                  }
                >
                  {/* {t(`common:${crumb.label}`)} */}
                  {crumb.label}
                </div>
              </Link>
            </li>
          ))}
      </ol>
    </div>
  )
}

export default Breadcrumb
