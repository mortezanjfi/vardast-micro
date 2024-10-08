"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import CardContainer from "@vardast/component/desktop/CardContainer"
import Link from "@vardast/component/Link"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
import NoResult from "@vardast/component/NoResult"
import {
  Banner,
  ThreeBannerStatuses,
  useGetSlidersQuery
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { ApiCallStatusEnum } from "@vardast/type/Enums"
import { getContentByApiStatus } from "@vardast/util/GetContentByApiStatus"
import clsx from "clsx"
import useTranslation from "next-translate/useTranslation"

import SliderDeleteModal from "@/app/(admin)/app-management/main/components/SliderDeleteModal"

const renderedListStatus = {
  [ApiCallStatusEnum.LOADING]: <Loading />,
  [ApiCallStatusEnum.ERROR]: <LoadingFailed />,
  [ApiCallStatusEnum.EMPTY]: <NoResult entity="slider" />,
  [ApiCallStatusEnum.DEFAULT]: null
}

type Props = {}

export const statusSliderFa = {
  [ThreeBannerStatuses.Confirmed]: {
    name_fa: "تایید شده"
  },
  [ThreeBannerStatuses.Pending]: {
    name_fa: "در انتظار تایید"
  },
  [ThreeBannerStatuses.Rejected]: {
    name_fa: "رد شده"
  }
}

function SlidersPage({}: Props) {
  const { t } = useTranslation()
  const router = useRouter()
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [sliderToDelete, setSliderToDelete] = useState<Banner>()

  const sliders = useGetSlidersQuery(graphqlRequestClientWithToken, {
    IndexBannerInput: {}
  })

  const ordersLength = useMemo(
    () => sliders?.data?.getBanners?.length,
    [sliders?.data?.getBanners?.length]
  )

  const addSlider = () => {
    router.push("/app-management/main/new-slider")
  }
  return (
    <>
      <SliderDeleteModal
        open={deleteModalOpen}
        sliderToDelete={sliderToDelete}
        onOpenChange={setDeleteModalOpen}
      />
      <div className="flex flex-col gap-7">
        <CardContainer
          button={{
            disabled: sliders.isLoading || sliders.isLoading,
            loading: sliders.isLoading,
            onClick: addSlider,
            text: "افزودن اسلایدر",
            variant: "primary"
          }}
          title="لیست‌ اسلایدرها"
        >
          {renderedListStatus[
            getContentByApiStatus(sliders, !!ordersLength)
          ] || (
            <>
              <div className="overflow-x-scroll">
                <table className="table-hover table">
                  <thead>
                    <tr>
                      <th>{t("common:row")}</th>
                      <th>{t("common:title")}</th>
                      <th className="border">{t("common:link")}</th>

                      <th>
                        {t("common:entity_size", {
                          entity: t("common:image")
                        })}
                      </th>
                      <th>{t("common:display_sort")}</th>
                      <th>{t("common:status")}</th>
                      <th>{t("common:operation")}</th>
                    </tr>
                  </thead>

                  <tbody className="border-collapse border">
                    {sliders.data.getBanners.map(
                      (slider, index) =>
                        slider && (
                          <tr className=" hover:bg-alpha-50" key={slider?.id}>
                            <td className="w-4 border">
                              <span>{digitsEnToFa(index + 1)}</span>
                            </td>
                            <td>{slider?.name || "-"}</td>
                            <td>{slider?.url || "-"}</td>
                            <td className="flex gap-1">
                              <span
                                className={clsx(
                                  "tag ",
                                  slider.small.id ? "tag-success" : "tag-danger"
                                )}
                              >
                                SM
                              </span>
                              <span
                                className={clsx(
                                  "tag ",
                                  slider.medium.id
                                    ? "tag-success"
                                    : "tag-danger"
                                )}
                              >
                                MD
                              </span>
                              <span
                                className={clsx(
                                  "tag",
                                  slider.large.id ? "tag-success" : "tag-danger"
                                )}
                              >
                                LG
                              </span>
                              <span
                                className={clsx(
                                  "tag ",
                                  slider.xlarge.id
                                    ? "tag-success"
                                    : "tag-danger"
                                )}
                              >
                                XL
                              </span>
                            </td>
                            <td>{digitsEnToFa(slider?.sort)}</td>
                            <td>{statusSliderFa[slider?.status]?.name_fa}</td>
                            <td>
                              <Link
                                href={`/app-management/main/${slider?.id}`}
                                target="_blank"
                              >
                                <span className="tag cursor-pointer text-blue-500">
                                  {t("common:edit")}
                                </span>
                              </Link>
                              /
                              <span
                                className="tag cursor-pointer text-error"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setDeleteModalOpen(true)
                                  setSliderToDelete(slider as Banner)
                                }}
                              >
                                {t("common:delete")}
                              </span>
                            </td>
                          </tr>
                        )
                    )}
                  </tbody>
                </table>
              </div>
              {/* <Pagination
              total={sliders?.data?.getBanners?.length?? 0}
              page={currentPage}
              onChange={(page) => {
                setCurrentPage(page)
              }}
            /> */}
            </>
          )}
        </CardContainer>
      </div>
    </>
  )
}

export default SlidersPage
