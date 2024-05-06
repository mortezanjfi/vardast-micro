"use client"

import { useState } from "react"
import { notFound, useRouter } from "next/navigation"
import graphqlRequestClientAdmin from "@/graphqlRequestClientAdmin"
import Link from "@vardast/component/Link"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
import NoResult from "@vardast/component/NoResult"
import PageHeader from "@vardast/component/PageHeader"
import { useGetAllUoMsQuery } from "@vardast/graphql/generated"
import { Button } from "@vardast/ui/button"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"

import Pagination from "@/app/(admin)/components/Pagination"

const UOMs = () => {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState<number>(1)

  const { isLoading, error, data } = useGetAllUoMsQuery(
    graphqlRequestClientAdmin,
    {
      indexUomInput: {
        page: currentPage
      }
    }
  )

  if (isLoading) return <Loading />
  if (error) return <LoadingFailed />
  if (!data) notFound()
  if (!data.uoms.data.length) return <NoResult entity="uom" />

  return (
    <>
      <PageHeader title={t("common:uoms_index_title")}>
        {session?.abilities?.includes("gql.products.uom.store") && (
          <Link href="/admin/uoms/new">
            <Button size="medium">
              {t("common:add_entity", { entity: t("common:uom") })}
            </Button>
          </Link>
        )}
      </PageHeader>
      <div className="card table-responsive rounded">
        <table className="table-hover table">
          <thead>
            <tr>
              <th></th>
              <th>{t("common:symbol")}</th>
              <th>{t("common:status")}</th>
            </tr>
          </thead>
          <tbody>
            {data.uoms.data.map(
              (uom) =>
                uom && (
                  <tr
                    key={uom.id}
                    onClick={() => router.push(`/admin/uoms/${uom.id}`)}
                  >
                    <td>
                      <span className="font-medium text-alpha-800">
                        {uom.name}
                      </span>
                    </td>
                    <td>
                      <span className="font-medium text-alpha-800">
                        {uom.symbol}
                      </span>
                    </td>
                    <td>
                      {uom.isActive ? (
                        <span className="tag tag-dot tag-success tag-sm">
                          {t("common:active")}
                        </span>
                      ) : (
                        <span className="tag tag-dot tag-gray tag-sm">
                          {t("common:inactive")}
                        </span>
                      )}
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        total={data.uoms.lastPage}
        page={currentPage}
        onChange={(page) => {
          setCurrentPage(page)
        }}
      />
    </>
  )
}

export default UOMs
