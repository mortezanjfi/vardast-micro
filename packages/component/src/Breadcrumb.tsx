"use client"

import { useContext, useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { LayoutContext } from "@vardast/provider/LayoutProvider"
import { CrumbItemProps } from "@vardast/type/breadcrumb"
import { stringHasOnlyNumberValidator } from "@vardast/util/stringHasOnlyNumberValidator"
import { useAtomValue } from "jotai"
import useTranslation from "next-translate/useTranslation"

import Link from "./Link"

const Breadcrumb = ({ items: itemsProps }: { items?: CrumbItemProps[] }) => {
  const { breadcrumbAtom } = useContext(LayoutContext)
  const itemsContext = useAtomValue(breadcrumbAtom)
  const pathname = usePathname()
  const [breadcrumbs, setBreadcrumbs] = useState<CrumbItemProps[]>()
  const { t } = useTranslation()

  const items = itemsProps ?? itemsContext

  useEffect(() => {
    let tempBreadcrumbs: CrumbItemProps[]

    if (items.length) {
      tempBreadcrumbs = items
    } else {
      const pathWithoutQuery = pathname?.split("?")[0]
      let pathArray = pathWithoutQuery?.split("/")
      pathArray?.shift()

      pathArray = pathArray?.filter((path) => path !== "")

      tempBreadcrumbs = pathArray?.map((path, index) => {
        const href = "/" + pathArray?.slice(0, index + 1)?.join("/")
        return {
          path: href,
          label: stringHasOnlyNumberValidator(path)
            ? t(`common:details`)
            : +path > 0
              ? path
              : t(`common:${path}`),
          isCurrent: index === pathArray?.length - 1
        }
      })
    }

    setBreadcrumbs(tempBreadcrumbs)
  }, [pathname, items])

  return (
    <ol aria-label="breadcrumb" className="app-breadcrumb">
      <li className="flex items-end align-middle leading-none">
        <Link aria-current={pathname === "/" ? "page" : "false"} href="/">
          <div className="text-alpha-600" title={process.env.NEXT_PUBLIC_TITLE}>
            وردست
          </div>
        </Link>
      </li>
      {breadcrumbs ? (
        breadcrumbs.map((crumb, idx) => (
          <li
            className="flex h-4 items-end align-middle leading-none"
            key={idx}
          >
            {idx < breadcrumbs.length && (
              <span className="mx-1 text-alpha-400">/</span>
            )}
            <Link href={crumb.path} passHref>
              <div
                aria-current={crumb.isCurrent ? "page" : "false"}
                className={
                  idx < breadcrumbs.length - 1
                    ? "text-alpha-600"
                    : "text-primary"
                }
                title={crumb.label}
              >
                {/* {t(`common:${crumb.label}`)} */}
                {crumb.label}
              </div>
            </Link>
          </li>
        ))
      ) : (
        <li className="animated-card flex h-4 w-32 items-end align-middle leading-none"></li>
      )}
    </ol>
  )
}

export default Breadcrumb
