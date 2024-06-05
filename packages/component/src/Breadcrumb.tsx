"use client"

import { useContext, useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { LayoutContext } from "@vardast/provider/LayoutProvider"
import { BreadcrumbProps, CrumbItemProps } from "@vardast/type/breadcrumb"
import { stringHasOnlyNumberValidator } from "@vardast/util/stringHasOnlyNumberValidator"
import { useAtomValue } from "jotai"
import useTranslation from "next-translate/useTranslation"

import Link from "./Link"

const Breadcrumb = ({
  dynamic: dynamicProps,
  items: itemsProps
}: BreadcrumbProps) => {
  const { breadcrumbAtom } = useContext(LayoutContext)
  const { dynamic: dynamicContext, items: itemsContext } =
    useAtomValue(breadcrumbAtom)
  const pathname = usePathname()
  const [breadcrumbs, setBreadcrumbs] = useState<CrumbItemProps[]>()
  const { t } = useTranslation()

  const items = itemsProps ?? itemsContext

  const dynamic = dynamicProps ?? dynamicContext

  useEffect(() => {
    let tempBreadcrumbs: CrumbItemProps[]

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
    <ol className="app-breadcrumb" aria-label="breadcrumb">
      <li className="flex items-end align-middle leading-none">
        <Link href="/" aria-current={pathname === "/" ? "page" : "false"}>
          <div title={process.env.NEXT_PUBLIC_TITLE} className="text-alpha-600">
            وردست
          </div>
        </Link>
      </li>
      {breadcrumbs ? (
        breadcrumbs.map((crumb, idx) => (
          <li
            key={idx}
            className="flex h-4 items-end align-middle leading-none"
          >
            {idx < breadcrumbs.length && (
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
        ))
      ) : (
        <li className="animated-card flex h-4 w-32 items-end align-middle leading-none"></li>
      )}
    </ol>
  )
}

export default Breadcrumb
