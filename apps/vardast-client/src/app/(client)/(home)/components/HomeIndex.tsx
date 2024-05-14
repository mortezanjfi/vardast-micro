"use client"

import { useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import { usePathname, useRouter } from "next/navigation"
import { useQuery, UseQueryResult } from "@tanstack/react-query"
import {
  FileModelTypeEnum,
  GetAllBlogsQuery,
  GetAllBrandsCountQuery,
  GetAllProductsQuery,
  GetAllSellersCountQuery,
  GetBannerHomePageQuery,
  GetVocabularyQuery
} from "@vardast/graphql/generated"
import { getAllBrandsCountQueryFn } from "@vardast/query/queryFns/allBrandsCountQueryFns"
import { getAllProductsQueryFn } from "@vardast/query/queryFns/allProductsQueryFns"
import { getAllSellersCountQueryFn } from "@vardast/query/queryFns/allSellersCountQueryFns"
import { bannerHomePageQueryFns } from "@vardast/query/queryFns/bannerHomePageQueryFns"
import { getAllBlogsQueryFn } from "@vardast/query/queryFns/getAllBlogsQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { getVocabularyQueryFn } from "@vardast/query/queryFns/vocabularyQueryFns"
import { Button } from "@vardast/ui/button"
import clsx from "clsx"
import { LucideX } from "lucide-react"
import { useSession } from "next-auth/react"

import DesktopHomeIndex from "@/app/(client)/(home)/components/DesktopHomeIndex"
import MobileHomeIndex from "@/app/(client)/(home)/components/MobileHomeIndex"

const pdfBlogUrl =
  "blog.vardast.com/%d8%a2%d8%ae%d8%b1%db%8c%d9%86-%da%af%d8%b2%d8%a7%d8%b1%d8%b4-%d9%85%d8%b9%d8%a7%d9%85%d9%84%d8%a7%d8%aa-%d9%85%d8%b3%da%a9%d9%86-%d8%af%d8%b1-%d8%aa%d9%87%d8%b1%d8%a7%d9%86%d9%81%d8%b1%d9%88%d8%b1/"

// const DesktopHomeIndex = dynamic(
//   () => import("@/app/(client)/(home)/components/DesktopHomeIndex"),
//   {
//     ssr: false
//   }
// )

// const MobileHomeIndex = dynamic(
//   () => import("@/app/(client)/(home)/components/MobileHomeIndex"),
//   {
//     ssr: false
//   }
// )

const PwaNotificationProvider = dynamic(
  () => import("@vardast/component/PwaNotification"),
  {
    ssr: false
  }
)

export type IHomeProps = {
  isMobileView: boolean
  allProductsQuery: UseQueryResult<GetAllProductsQuery, unknown>
  homeSlidersQuery: UseQueryResult<GetBannerHomePageQuery, unknown>
  allSellersCount: UseQueryResult<GetAllSellersCountQuery>
  allBrandsCount: UseQueryResult<GetAllBrandsCountQuery>
  getVocabularyQueryFcQuery: UseQueryResult<GetVocabularyQuery>
  getAllBlogsQuery: UseQueryResult<GetAllBlogsQuery>
  // session: Session | null
}

type HomeIndexProps = {
  isMobileView: boolean
  // session: Session | null
}

const HomeIndex = ({ isMobileView }: HomeIndexProps) => {
  const [downloadPdfModal, setDownloadPdfModal] = useState(false)
  const pathname = usePathname()
  const session = useSession()
  const router = useRouter()
  const allProductsQuery = useQuery<GetAllProductsQuery>(
    [
      QUERY_FUNCTIONS_KEY.ALL_PRODUCTS_QUERY_KEY,
      {
        page: 1
      }
    ],
    () =>
      getAllProductsQueryFn({
        page: 1
      }),
    {
      keepPreviousData: true,
      staleTime: 999999999
    }
  )

  const getVocabularyQueryFcQuery = useQuery<GetVocabularyQuery>({
    queryKey: [
      QUERY_FUNCTIONS_KEY.VOCABULARY_QUERY_KEY,
      { slug: "product_categories" }
    ],
    queryFn: () => getVocabularyQueryFn("product_categories"),
    keepPreviousData: true,
    staleTime: 999999999
  })

  const allBrandsCount = useQuery<GetAllBrandsCountQuery>(
    [QUERY_FUNCTIONS_KEY.GET_ALL_BRANDS_COUNT_QUERY_KEY],
    getAllBrandsCountQueryFn,
    {
      keepPreviousData: true,
      staleTime: 999999999
    }
  )

  const allSellersCount = useQuery<GetAllSellersCountQuery>(
    [QUERY_FUNCTIONS_KEY.ALL_SELLERS_COUNT_QUERY_KEY],
    getAllSellersCountQueryFn,
    {
      keepPreviousData: true,
      staleTime: 999999999
    }
  )

  const homeSlidersQuery = useQuery<GetBannerHomePageQuery>(
    [QUERY_FUNCTIONS_KEY.BANNER_HOME_PAGE_KEY, FileModelTypeEnum.Slider],
    () => bannerHomePageQueryFns({ type: FileModelTypeEnum.Slider }),
    {
      keepPreviousData: true,
      staleTime: 999999999
    }
  )

  const getAllBlogsQuery = useQuery<GetAllBlogsQuery>(
    [QUERY_FUNCTIONS_KEY.GET_ALL_BLOGS, { page: 1 }],
    () => getAllBlogsQueryFn({ page: 1 }),
    {
      keepPreviousData: true,
      staleTime: 999999999
    }
  )

  const homeProps: IHomeProps = useMemo(
    () => ({
      // session,
      isMobileView,
      allProductsQuery,
      homeSlidersQuery,
      allSellersCount,
      allBrandsCount,
      getVocabularyQueryFcQuery,
      getAllBlogsQuery
    }),
    [
      // session
      isMobileView,
      allProductsQuery,
      homeSlidersQuery,
      allSellersCount,
      allBrandsCount,
      getVocabularyQueryFcQuery,
      getAllBlogsQuery
    ]
  )

  const setLocalStoragePdf = (finish?: boolean) => {
    const pdfCount = localStorage.getItem("pdf")
    localStorage.setItem(
      "pdf",
      finish ? "3" : pdfCount ? `${+pdfCount + 1}` : "1"
    )
  }

  const downloadPdf = (e) => {
    e.preventDefault()
    setLocalStoragePdf(true)
    if (!!session.data) {
      // createEventTrackerDownloadPdfMutation.mutate({
      //   createEventTrackerInput: {
      //     type,
      //     subjectType: EventTrackerSubjectTypes.Notification,
      //     subjectId: data?.contacts?.at(0)?.id || 0,
      //     url: window.location.href
      //   }
      // })
      window.location.href = `https://${pdfBlogUrl}`
      return
    }
    router.replace(`/auth/signin/foreign/${pdfBlogUrl}`)
  }

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      (!localStorage.getItem("pdf") ||
        (localStorage.getItem("pdf") && localStorage.getItem("pdf") !== "3")) &&
      pathname === "/"
    ) {
      setTimeout(() => {
        setDownloadPdfModal(true)
      }, 2000)
    }
  }, [pathname])

  return (
    <>
      {downloadPdfModal && pathname === "/" && (
        <div
          onClick={downloadPdf}
          className={clsx(
            "fixed bottom-[calc(env(safe-area-inset-bottom)*0.5+8rem)] left-0 right-0 z-50 flex w-full max-w-[500px] transform cursor-pointer items-center justify-between gap-x bg-info px-6 py transition-all md:bottom-10 md:right-10 md:ml-auto md:rounded-lg md:px-12 md:py-4"
          )}
        >
          <Button
            onClick={(e) => {
              e.stopPropagation()
              e.nativeEvent.preventDefault()
              e.nativeEvent.stopImmediatePropagation()
              setLocalStoragePdf()
              setDownloadPdfModal(false)
            }}
            size="small"
            className="absolute -top-5 right-5 h-7 w-7 !bg-secondary-800"
            iconOnly
            variant="ghost"
          >
            <LucideX className="h-full w-full text-alpha-white" />
          </Button>
          <p className="text-center text-lg font-bold text-alpha-white">
            آخرین گزارش معاملات مسکن در تهران
            <br />
            <span className="text-sm">(فروردین ۱۴۰۳)</span>
          </p>
          <Button
            // loading={createEventTrackerDownloadPdfMutation.isLoading}
            // disabled={createEventTrackerDownloadPdfMutation.isLoading}
            size="small"
            className="!bg-error !px-5 !py-3 font-bold"
            variant="primary"
          >
            دانلود
          </Button>
        </div>
      )}
      <PwaNotificationProvider isMobileView={isMobileView} />
      {isMobileView ? (
        <MobileHomeIndex {...homeProps} />
      ) : (
        <DesktopHomeIndex {...homeProps} />
      )}
    </>
  )
}

export default HomeIndex
