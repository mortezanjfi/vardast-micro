"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { UseQueryResult } from "@tanstack/react-query"
import Card from "@vardast/component/Card"
import Link from "@vardast/component/Link"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
import NoResult from "@vardast/component/NoResult"
import PageHeader from "@vardast/component/PageHeader"
import Pagination from "@vardast/component/Pagination"
import { useGetAllAttributesQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { ApiCallStatusEnum } from "@vardast/type/Enums"
import { Button } from "@vardast/ui/button"
import { LucideCheck, LucidePlus, LucideX } from "lucide-react"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import { AttributesFilter } from "@/app/(admin)/attributes/components/AttributesFilter"

const renderedListStatus = {
  [ApiCallStatusEnum.LOADING]: <Loading />,
  [ApiCallStatusEnum.ERROR]: <LoadingFailed />,
  [ApiCallStatusEnum.EMPTY]: <NoResult entity="attribute" />,
  [ApiCallStatusEnum.DEFAULT]: null
}

const getContentByApiStatus = (
  apiQuery: UseQueryResult<any, unknown>,
  queryLength: boolean
) => {
  if (apiQuery.isLoading) {
    return ApiCallStatusEnum.LOADING
  }
  if (apiQuery.isError) {
    return ApiCallStatusEnum.ERROR
  }
  if (!queryLength || !apiQuery.data) {
    return ApiCallStatusEnum.EMPTY
  }
  return ApiCallStatusEnum.DEFAULT
}

const filterSchema = z.object({
  name: z.string().optional()
})

export type AttributesFilterFields = TypeOf<typeof filterSchema>

const Attributes = () => {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState<number>(1)

  const form = useForm<AttributesFilterFields>({
    resolver: zodResolver(filterSchema)
  })

  const attributes = useGetAllAttributesQuery(graphqlRequestClientWithToken, {
    indexAttributeInput: {
      page: currentPage
    }
  })

  const attributesLength = useMemo(
    () => attributes.data?.attributes.data.length,
    [attributes.data?.attributes.data.length]
  )

  return (
    <>
      <AttributesFilter form={form} />
      <Card className=" table-responsive mt-8 rounded">
        <PageHeader
          containerClass="items-center"
          title={t("common:attributes_index_title")}
          titleClasses="text-[14px] font-normal "
          titleContainerClasses="border-b-2 border-primary-600 py-2"
        >
          {session?.abilities.includes("gql.products.attribute.index") && (
            <Link href="/attributes/new">
              <Button size="medium">
                <LucidePlus size="14.4" />
                {t("common:add_entity", { entity: t("common:attribute") })}
              </Button>
            </Link>
          )}
        </PageHeader>
        {renderedListStatus[
          getContentByApiStatus(attributes, !!attributesLength)
        ] || (
          <>
            <table className="table-hover table">
              <thead>
                <tr>
                  <th>{t("common:attribute")}</th>
                  <th>{t("common:type")}</th>
                  <th>{t("common:filterable")}</th>
                  <th>{t("common:visibility")}</th>
                  <th>{t("common:required")}</th>
                </tr>
              </thead>
              <tbody>
                {attributes.data?.attributes.data.map(
                  (attribute) =>
                    attribute && (
                      <tr
                        key={attribute.id}
                        onClick={() =>
                          router.push(`/attributes/${attribute.id}`)
                        }
                      >
                        <td>
                          <span className="font-medium text-alpha-800">
                            {attribute.name}
                          </span>
                        </td>
                        <td>
                          <span className="tag tag-xs tag-gray tag-light">
                            {attribute.type}
                          </span>
                        </td>
                        <td align="center">
                          {attribute.isFilterable ? (
                            <span className="tag tag-light tag-icon tag-success tag-sm h-8 w-8 rounded-full">
                              <LucideCheck className="icon" />
                            </span>
                          ) : (
                            <span className="tag tag-light tag-icon tag-gray tag-sm h-8 w-8 rounded-full">
                              <LucideX className="icon" />
                            </span>
                          )}
                        </td>
                        <td align="center">
                          {attribute.isPublic ? (
                            <span className="tag tag-light tag-icon tag-success tag-sm h-8 w-8 rounded-full">
                              <LucideCheck className="icon" />
                            </span>
                          ) : (
                            <span className="tag tag-light tag-icon tag-gray tag-sm h-8 w-8 rounded-full">
                              <LucideX className="icon" />
                            </span>
                          )}
                        </td>
                        <td align="center">
                          {attribute.isRequired ? (
                            <span className="tag tag-light tag-icon tag-success tag-sm h-8 w-8 rounded-full">
                              <LucideCheck className="icon" />
                            </span>
                          ) : (
                            <span className="tag tag-light tag-icon tag-gray tag-sm h-8 w-8 rounded-full">
                              <LucideX className="icon" />
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </table>

            <Pagination
              page={currentPage}
              total={attributes.data?.attributes.lastPage ?? 0}
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

export default Attributes
