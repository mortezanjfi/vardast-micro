"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { notFound } from "next/navigation"
import { MapPinIcon } from "@heroicons/react/24/outline"
import { CheckBadgeIcon } from "@heroicons/react/24/solid"
import { UseQueryResult } from "@tanstack/react-query"
import brandSellerBlank from "@vardast/asset/brand-seller-blank.svg"
import {
  EntityTypeEnum,
  GetBrandQuery,
  GetIsFavoriteQuery,
  GetSellerQuery
} from "@vardast/graphql/generated"
import {
  setBreadCrumb,
  setPageHeader
} from "@vardast/provider/LayoutProvider/use-layout"
import {
  Segments,
  SegmentsContent,
  SegmentsList,
  SegmentsListItem
} from "@vardast/ui/segment"
import clsx from "clsx"
import { setDefaultOptions } from "date-fns"
import { faIR } from "date-fns/locale"
import useTranslation from "next-translate/useTranslation"
import { useQueryState } from "next-usequerystate"

import FavoriteIcon from "./FavoriteIcon"
import ShareIcon from "./ShareIcon"

export type BrandOrSellerProfileTab = {
  value: string
  title: JSX.Element
  Content: () => JSX.Element
  className?: string | undefined
}
export type SellerQuery = GetSellerQuery["seller"]
export type BrandQuery = GetBrandQuery["brand"]

interface IBrandOrSellerProfile {
  slug: (string | number)[]
  type: EntityTypeEnum.Brand | EntityTypeEnum.Seller
  data?: BrandQuery | SellerQuery
  isFavoriteQuery: UseQueryResult<GetIsFavoriteQuery, unknown>
  tabs: BrandOrSellerProfileTab[]
  isMobileView: boolean
}

const BrandOrSellerProfile = ({
  type,
  data,
  slug,
  isFavoriteQuery,
  tabs,
  isMobileView
}: IBrandOrSellerProfile) => {
  if (!data) notFound()
  const [openTabName, setOpenTabName] = useQueryState("tab")
  const [activeTab, setActiveTab] = useState<string>("")
  const { t } = useTranslation()
  const isSellerQuery = () => type === EntityTypeEnum.Seller

  setBreadCrumb([
    {
      label: t(isSellerQuery() ? "common:sellers" : "common:brands"),
      path: "/brands",
      isCurrent: false
    },
    {
      label: data.name,
      path: `${isSellerQuery() ? `sellers/${data.id}` : `brands/${data.id}`}`,
      isCurrent: true
    }
  ])

  setDefaultOptions({
    locale: faIR,
    weekStartsOn: 6
  })

  useEffect(() => {
    setActiveTab(openTabName || tabs[0].value)
  }, [openTabName, tabs])

  console.log(data)

  const PageHeader = (
    <div className="w-full md:flex md:gap-6">
      <div className="relative flex flex-col justify-start overflow-hidden md:w-80 md:min-w-80 md:flex-shrink-0 md:justify-center md:rounded-2xl md:border">
        <div className="flex  flex-col gap-y bg-alpha-white md:h-auto md:min-h-full ">
          <div className="flex h-full flex-col items-center justify-center gap-y bg-alpha-white">
            {isMobileView && isSellerQuery() ? null : (
              <div className="flex h-72 min-h-72 w-full flex-col items-center justify-center md:!h-fit md:!min-h-fit md:gap-7 md:py-10">
                <div className="h-full w-full border-alpha-400  p-0.5 md:h-36 md:!min-h-36  md:w-36 md:rounded-full md:border-2">
                  {isSellerQuery() && (data as SellerQuery).isBlueTik && (
                    <>
                      <CheckBadgeIcon className="w-h-7 absolute right-1 top-0 z-20 h-7 -translate-y-1 translate-x-1 text-info" />
                      <span className="absolute right-2 top-1 h-3 w-3 rounded-full bg-alpha-white"></span>
                    </>
                  )}
                  <div className="aspect-square h-full w-full">
                    <Image
                      alt="seller"
                      className="h-full w-full object-contain md:rounded-full"
                      height={100}
                      src={
                        isMobileView &&
                        (data as BrandQuery)?.bannerMobile?.presignedUrl?.url
                          ? (data as BrandQuery)?.bannerMobile?.presignedUrl
                              ?.url
                          : brandSellerBlank
                      }
                      width={100}
                    />
                  </div>
                </div>
                {(!isMobileView || isSellerQuery()) && (
                  <div className="flex flex-col items-center gap-y-2 pt">
                    <h1 className="text-base">{data.name}</h1>
                    {data?.addresses?.length > 0 &&
                      data.addresses[0].city.name && (
                        <p className="flex h-4 items-center gap-x-1 py-1 text-xs text-alpha-600">
                          <MapPinIcon className="h-3 w-3 text-alpha-600" />
                          {data.addresses[0].city.name}
                        </p>
                      )}
                  </div>
                )}
              </div>
            )}

            <div className="flex w-full grid-cols-2 justify-between px-6 pb-6 pt-2 md:grid md:!p-0">
              {isMobileView && (
                <div className=" flex items-center gap-2">
                  <Image
                    alt="logo"
                    className="rounded-full border border-alpha-400"
                    height={64}
                    src={
                      data?.logoFile?.presignedUrl?.url
                        ? data?.logoFile?.presignedUrl?.url
                        : brandSellerBlank
                    }
                    width={64}
                  />
                  <h1 className="text-base font-semibold">{data?.name}</h1>
                </div>
              )}
              <div className="col-span-2 flex grid-cols-2 gap-5 md:grid md:gap-0 md:divide-x md:divide-x-reverse md:border-t md:py-3">
                <FavoriteIcon
                  entityId={+slug[0]}
                  isFavoriteQuery={isFavoriteQuery}
                  type={type}
                />
                <ShareIcon name={data.name} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {!isMobileView && (
        <div className="relative hidden aspect-auto w-full overflow-hidden rounded-2xl border md:col-span-9 md:block">
          <Image
            alt="banner"
            className="h-full w-full object-cover"
            fill
            src={
              (data as BrandQuery).bannerDesktop?.presignedUrl.url
                ? `${(data as BrandQuery).bannerDesktop?.presignedUrl.url}`
                : brandSellerBlank
            }
          />
        </div>
      )}
    </div>
  )

  setPageHeader(PageHeader)

  return (
    <div className="flex flex-col bg-alpha-white md:h-full md:gap-9">
      <Segments
        className="sticky left-0 right-0 top-0 h-full flex-col gap-9 bg-alpha-white sm:flex md:ml-auto md:w-full md:overflow-visible"
        value={activeTab}
        onValueChange={(value) => {
          if (value === tabs[0].value) {
            setOpenTabName(null)
            setActiveTab(value)
            return
          }
          setOpenTabName(value)
        }}
      >
        <SegmentsList className="border-b pb  md:border-b-2 md:pb-5" wrap>
          {tabs.map(({ title, value }) => (
            <SegmentsListItem
              className={clsx("no-select")}
              key={value}
              noStyle
              style={{
                width:
                  !isMobileView || tabs.length > 3
                    ? "auto"
                    : `${100 / tabs.length}%`
              }}
              value={value}
            >
              <>
                <div
                  className={clsx(
                    "mx-1 cursor-pointer rounded-full border bg-alpha-white px-4 py-2.5 text-sm",
                    value === activeTab
                      ? "border-primary bg-primary text-alpha-white"
                      : "border-alpha-300"
                  )}
                >
                  {title}
                </div>
              </>
            </SegmentsListItem>
          ))}
        </SegmentsList>
        {tabs.map(({ Content, className, ...props }) => (
          <SegmentsContent
            className={clsx("flex-1", className)}
            key={props.value}
            value={props.value}
          >
            <Content />
          </SegmentsContent>
        ))}
      </Segments>
    </div>
  )
}

export default BrandOrSellerProfile
