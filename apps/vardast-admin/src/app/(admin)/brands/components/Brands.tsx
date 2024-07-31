"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import Card from "@vardast/component/Card"
import Link from "@vardast/component/Link"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
import NoResult from "@vardast/component/NoResult"
import PageHeader from "@vardast/component/PageHeader"
import Pagination from "@vardast/component/Pagination"
import {
  Brand,
  ThreeStateSupervisionStatuses,
  useGetAllBrandsQuery
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { ApiCallStatusEnum } from "@vardast/type/Enums"
import { Button } from "@vardast/ui/button"
import { checkBooleanByString } from "@vardast/util/checkBooleanByString"
import { getContentByApiStatus } from "@vardast/util/GetContentByApiStatus"
import { LucidePlus, LucideWarehouse } from "lucide-react"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

// import { BrandFileUpload } from "@/app/admin/brands/components/BrandFileUpload"
import BrandDeleteModal from "@/app/(admin)/brands/components/BrandDeleteModal"
import { BrandFilter } from "@/app/(admin)/brands/components/BrandFilter"

const renderedListStatus = {
  [ApiCallStatusEnum.LOADING]: <Loading />,
  [ApiCallStatusEnum.ERROR]: <LoadingFailed />,
  [ApiCallStatusEnum.EMPTY]: <NoResult entity="brand" />,
  [ApiCallStatusEnum.DEFAULT]: null
}

const filterSchema = z.object({
  brand: z.string(),
  logoStatus: z.string(),
  catalogStatus: z.string(),
  priceListStatus: z.string(),
  bannerStatus: z.string()
})
export type FilterFields = TypeOf<typeof filterSchema>

const Brands = () => {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [brandToDelete, setBrandToDelete] = useState<Brand>()
  const [brandsQueryParams, setBrandsQueryParams] = useState<FilterFields>({})
  const form = useForm<FilterFields>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      brand: "",
      logoStatus: "",
      catalogStatus: "",
      priceListStatus: "",
      bannerStatus: ""
    }
  })

  const brands = useGetAllBrandsQuery(
    graphqlRequestClientWithToken,
    {
      indexBrandInput: {
        page: currentPage,
        name: brandsQueryParams.brand,
        hasPriceList: checkBooleanByString(brandsQueryParams.priceListStatus),
        hasCatalogeFile: checkBooleanByString(brandsQueryParams.catalogStatus),
        hasLogoFile: checkBooleanByString(brandsQueryParams.logoStatus),
        hasBannerFile: checkBooleanByString(brandsQueryParams.bannerStatus)
      }
    },
    {
      queryKey: [
        {
          name: brandsQueryParams.brand,
          hasPriceList: checkBooleanByString(brandsQueryParams.priceListStatus),
          hasCatalogeFile: checkBooleanByString(
            brandsQueryParams.catalogStatus
          ),
          hasLogoFile: checkBooleanByString(brandsQueryParams.logoStatus),
          hasBannerFile: checkBooleanByString(brandsQueryParams.bannerStatus),
          page: currentPage
        }
      ]
    }
  )

  const brandsLength = useMemo(
    () => brands.data?.brands.data.length,
    [brands.data?.brands.data.length]
  )
  // console.log(brands.data?.brands.);

  return (
    <>
      <BrandFilter form={form} setBrandsQueryParams={setBrandsQueryParams} />
      <Card className=" table-responsive mt-8 rounded">
        {/* <BrandFileUpload /> */}
        {/* <hr className="my-7"></hr> */}
        <PageHeader
          title={t("common:entity_list", { entity: t("common:brands") })}
          titleClasses="text-[14px] font-normal "
          containerClass="items-center"
          titleContainerClasses="border-b-2 border-primary-600 py-2"
        >
          {session?.abilities.includes("gql.products.brand.index") && (
            <Link href="/brands/new">
              <Button size="medium">
                <LucidePlus size="14.4" />

                {t("common:add_entity", { entity: t("common:brand") })}
              </Button>
            </Link>
          )}
        </PageHeader>
        <BrandDeleteModal
          open={deleteModalOpen}
          brandToDelete={brandToDelete as Brand}
          onOpenChange={setDeleteModalOpen}
        />
        {renderedListStatus[getContentByApiStatus(brands, !!brandsLength)] || (
          <>
            <table className="table-hover table">
              <thead>
                <tr>
                  <th>{t("common:row")}</th>
                  <th></th>
                  <th>{t("common:brand")}</th>
                  <th>
                    {t("common:entity_count", { entity: t("common:product") })}
                  </th>
                  {/* <th>{t("common:category")}</th> */}
                  {/* <th>{t("common:city")}</th> */}
                  <th>{t("common:price_list")}</th>
                  <th>{t("common:catalog")}</th>
                  <th>{t("common:banner")}</th>
                  <th>{t("common:status")}</th>
                  <th>{t("common:operation")}</th>
                </tr>
              </thead>
              <tbody className="border">
                {brands.data?.brands.data.map(
                  (brand, index) =>
                    brand && (
                      <tr key={brand.id}>
                        <td className="w-4">
                          <span>{digitsEnToFa(index + 1)}</span>
                        </td>
                        <td className="w-12 border-r-0.5">
                          <div className="relative flex aspect-square h-12 w-12 items-center justify-center overflow-hidden rounded bg-alpha-50">
                            {brand.logoFile ? (
                              <Image
                                src={
                                  brand.logoFile.presignedUrl.url ??
                                  "/images/seller-blank.png"
                                }
                                alt={brand.name}
                                fill
                                className="object-contain"
                              />
                            ) : (
                              <LucideWarehouse
                                className="h-5 w-5 text-alpha-400"
                                strokeWidth={1.5}
                              />
                            )}
                          </div>
                        </td>
                        <td>
                          <span className="font-medium text-alpha-800">
                            {brand.name}
                          </span>
                        </td>
                        <td className=" border-r-0.5">
                          {digitsEnToFa(addCommas(brand.sum))}
                        </td>
                        {/* <td className=" border-r-0.5"></td> */}
                        {/* <td className=" border-r-0.5">
                          {brand.addresses.map(
                            (address) => address.city.name
                          ) && "-"}
                        </td> */}
                        <td className=" border-r-0.5">
                          {" "}
                          {brand.priceList?.id ? (
                            <span className="tag  tag-sm tag-success">
                              {t("common:has")}
                            </span>
                          ) : (
                            <span className="tag tag-sm tag-danger">
                              {t("common:has_not")}
                            </span>
                          )}
                        </td>
                        <td className=" border-r-0.5 border-alpha-200">
                          {brand.catalog?.id ? (
                            <span className="tag  tag-sm tag-success">
                              {t("common:has")}
                            </span>
                          ) : (
                            <span className="tag tag-sm tag-danger">
                              {t("common:has_not")}
                            </span>
                          )}
                        </td>
                        <td className=" border-r-0.5 border-alpha-200">
                          {brand?.bannerDesktop?.id ? (
                            <span className="tag  tag-sm tag-success">
                              {t("common:has")}
                            </span>
                          ) : (
                            <span className="tag tag-sm tag-danger">
                              {t("common:has_not")}
                            </span>
                          )}
                        </td>
                        <td className=" border-r-0.5">
                          {brand.status ===
                            ThreeStateSupervisionStatuses.Confirmed && (
                            <span className="">{t("common:confirmed")}</span>
                          )}
                          {brand.status ===
                            ThreeStateSupervisionStatuses.Pending && (
                            <span className="">{t("common:pending")}</span>
                          )}
                          {brand.status ===
                            ThreeStateSupervisionStatuses.Rejected && (
                            <span className="">{t("common:rejected")}</span>
                          )}
                        </td>

                        <td className=" border-r-0.5">
                          <Link target="_blank" href={`/brands/${brand.id}`}>
                            <span className="tag cursor-pointer text-blue-500">
                              {" "}
                              {t("common:edit")}
                            </span>
                          </Link>
                          /
                          <span
                            className="tag cursor-pointer text-error"
                            onClick={(e) => {
                              e.stopPropagation()
                              setDeleteModalOpen(true)
                              setBrandToDelete(brand as Brand)
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
            <Pagination
              total={brands.data?.brands.lastPage ?? 0}
              page={currentPage}
              onChange={(page) => {
                setCurrentPage(page)
              }}
            />
          </>
        )}
      </Card>
    </>
  )
}

export default Brands
