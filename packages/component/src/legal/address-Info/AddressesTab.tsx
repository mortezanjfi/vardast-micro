"use client"

import { useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { UseQueryResult } from "@tanstack/react-query"
import {
  Address,
  AddressRelatedTypes,
  ThreeStateSupervisionStatuses
} from "@vardast/graphql/generated"
import { Button } from "@vardast/ui/button"
import { LucideCheck, LucideX } from "lucide-react"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"

import { ApiCallStatusEnum } from "../../../../type/src/Enums"
import { getContentByApiStatus } from "../../../../util/src/GetContentByApiStatus"
import CardContainer from "../../desktop/CardContainer"
import Link from "../../Link"
import Loading from "../../Loading"
import LoadingFailed from "../../LoadingFailed"
import NoResult from "../../NoResult"

// import { useToast } from "@vardast/hook/use-toast"

type AddressesTabProps = {
  data: UseQueryResult<any, unknown>
  relatedType: keyof typeof AddressRelatedTypes
  relatedId: number
  addresses?: Address[]
}

const renderedListStatus = {
  [ApiCallStatusEnum.LOADING]: <Loading />,
  [ApiCallStatusEnum.ERROR]: <LoadingFailed />,
  [ApiCallStatusEnum.EMPTY]: <NoResult entity="address" />,
  [ApiCallStatusEnum.DEFAULT]: null
}

const AddressesTab = ({
  data,
  relatedType,
  relatedId,
  addresses
}: AddressesTabProps) => {
  const { t } = useTranslation()
  // const { toast } = useToast()
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const addressLength = useMemo(() => addresses?.length, [addresses?.length])

  const createFallBack = () => {
    const params = new URLSearchParams(searchParams as any)
    if (params.has("tab")) {
      params.delete("tab")
    }
    params.append("tab", "addresses")
    const newFallBackUrl = `${pathname}?${params.toString()}`
    router.push(
      `/addresses/new?type=${relatedType}&id=${relatedId}&fallback=${newFallBackUrl}`
    )
  }

  return (
    <>
      {session?.abilities?.includes("gql.users.address.index") && (
        <div className="mb-6 flex items-end justify-between">
          <Button
            className="mr-auto"
            onClick={() =>
              // router.push(
              //   `/addresses/new?type=${relatedType}&id=${relatedId}&fallback=${pathname}`
              // )
              createFallBack()
            }
          >
            {t("common:add_entity", { entity: t("common:address") })}
          </Button>
        </div>
      )}

      <CardContainer className="card table-responsive rounded">
        {renderedListStatus[getContentByApiStatus(data, !!addressLength)] || (
          <table className="table-hover table">
            <thead>
              <tr>
                <th>{t("common:title")}</th>
                <th>{t("common:city")}</th>
                <th>{t("common:address")}</th>
                <th>{t("common:postalCode")}</th>
                <th>{t("common:status")}</th>
                <th>{t("common:visibility")}</th>
                <th>{t("common:operation")}</th>
              </tr>
            </thead>
            <tbody className="border-collapse border">
              {addresses.map(
                (address) =>
                  address && (
                    <tr
                      key={address.id}
                      // onClick={() =>
                      //   router.push(
                      //     `/addresses/${address.id}?fallback=${pathname}`
                      //   )
                      // }
                    >
                      <td>
                        <span className="font-bold">{address.title}</span>
                      </td>
                      <td>
                        {address.province.name}, {address.city.name}
                      </td>
                      <td>{address.address}</td>
                      <td className="text-center">
                        <span className="font-mono tracking-widest">
                          {address.postalCode || "--"}
                        </span>
                      </td>
                      <td>
                        {address.status ===
                          ThreeStateSupervisionStatuses.Confirmed && (
                          <span className="tag tag-light tag-sm tag-success">
                            {t("common:confirmed")}
                          </span>
                        )}
                        {address.status ===
                          ThreeStateSupervisionStatuses.Pending && (
                          <span className="tag tag-light tag-sm tag-warning">
                            {t("common:pending")}
                          </span>
                        )}
                        {address.status ===
                          ThreeStateSupervisionStatuses.Rejected && (
                          <span className="tag tag-light tag-sm tag-danger">
                            {t("common:rejected")}
                          </span>
                        )}
                      </td>
                      <td>
                        {address.isPublic ? (
                          <span className="tag tag-light tag-icon tag-success tag-sm h-8 w-8 rounded-full">
                            <LucideCheck className="icon" />
                          </span>
                        ) : (
                          <span className="tag tag-light tag-icon tag-gray tag-sm h-8 w-8 rounded-full">
                            <LucideX className="icon" />
                          </span>
                        )}
                      </td>
                      <td>
                        <Link
                          href={`/addresses/${address.id}?fallback=${pathname}`}
                        >
                          <span className="tag cursor-pointer text-blue-500">
                            {t("common:edit")}
                          </span>
                        </Link>
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        )}
      </CardContainer>
    </>
  )
}

export default AddressesTab
