"use client"

import { useCallback, useMemo } from "react"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import AddressDeleteModal from "@vardast/component/admin/address/AddressDeleteModal"
import AddressModal from "@vardast/component/admin/address/AddressModal"
import UserInfo from "@vardast/component/admin/user/UserInfo"
import { ITableProps, Table, useTable } from "@vardast/component/table"
import { RealModalEnum } from "@vardast/component/type"
import {
  Address,
  AddressRelatedTypes,
  useGetUserQuery,
  User
} from "@vardast/graphql/generated"
import { ThreeStateSupervisionStatusesFa } from "@vardast/lib/constants"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Badge } from "@vardast/ui/badge"
import { Button } from "@vardast/ui/button"
import { useModals } from "@vardast/ui/modal"
import { setDefaultOptions } from "date-fns"
import { faIR } from "date-fns/locale"
import { LucideCheck, LucideX } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

type Props = {
  uuid: string
}

const UserPage = ({ uuid }: Props) => {
  const { t } = useTranslation()
  const [modals, onChangeModals, onCloseModals] = useModals<RealModalEnum>()

  const getUserQuery = useGetUserQuery(graphqlRequestClientWithToken, {
    uuid
  })

  setDefaultOptions({
    locale: faIR,
    weekStartsOn: 6
  })

  const user = useMemo(() => getUserQuery.data?.user as User, [getUserQuery])

  // const tableProps: ITableProps<Session> = useTable({
  //   model: {
  //     name: "sessions",
  //     container: {
  //       title: t("common:sessions")
  //     },
  //     fetch: {
  //       directData: {
  //         data: user?.sessions,
  //         directLoading: getUserQuery.isLoading || getUserQuery.isFetching
  //       },
  //       options: {
  //         refetchOnMount: true
  //       }
  //     },
  //     columns: [
  //       {
  //         header: t("common:last_activity"),
  //         id: "lastActivityAt",
  //         accessorFn: ({ lastActivityAt }) =>
  //           digitsEnToFa(
  //             formatDistanceToNow(new Date(lastActivityAt).getTime(), {
  //               addSuffix: true
  //             })
  //           )
  //       },
  //       { header: t("common:agent"), accessorKey: "agent" }
  //     ]
  //   }
  // })

  // const roleTableProps: ITableProps<Role> = useTable({
  //   model: {
  //     name: "roles",
  //     container: {
  //       button: {
  //         onClick: () =>
  //           onChangeModals<Role>({
  //             type: RealModalEnum.ROLE
  //           }),
  //         text: t("common:add_new_entity", {
  //           entity: t("common:role")
  //         })
  //       },
  //       title: t(`common:roles`)
  //     },
  //     fetch: {
  //       directData: {
  //         data: user?.roles,
  //         directLoading: getUserQuery.isLoading || getUserQuery.isFetching
  //       }
  //     },
  //     columns: [{ header: t("common:name"), accessorKey: "displayName" }]
  //   }
  // })

  const addressTableProps: ITableProps<Address> = useTable({
    model: {
      name: "real-user-address",
      container: {
        button: {
          onClick: () =>
            onChangeModals<Pick<Address, "relatedId" | "relatedType">>({
              type: RealModalEnum.ADDRESS,
              data: {
                relatedId: user.id,
                relatedType: AddressRelatedTypes.User
              }
            }),
          text: t("common:add_new_entity", {
            entity: t("common:address")
          })
        },
        title: t(`common:addresses`)
      },
      onRow: {
        onClick: (row) => {
          onChangeModals({
            type: RealModalEnum.ADDRESS,
            data: row.original
          })
        }
      },
      fetch: {
        directData: {
          data: user?.addresses as Address[],
          directLoading: getUserQuery.isLoading || getUserQuery.isFetching
        }
      },
      columns: [
        { header: t("common:title"), accessorKey: "title" },
        {
          header: t("common:city"),
          id: "city",
          accessorFn: ({ province, city }) => `${province.name}, ${city.name}`
        },
        { header: t("common:address"), accessorKey: "address" },
        {
          header: t("common:postalCode"),
          id: "postalCode",
          accessorFn: ({ postalCode }) => digitsEnToFa(postalCode || "-")
        },
        {
          header: t("common:status"),
          id: "status",
          cell: ({ row }) => (
            <Badge
              variant={
                ThreeStateSupervisionStatusesFa[row?.original?.status]?.variant
              }
            >
              {ThreeStateSupervisionStatusesFa[row?.original?.status]?.name_fa}
            </Badge>
          )
        },
        {
          header: t("common:visibility"),
          id: "isPublic",
          cell: ({ row }) =>
            row?.original?.isPublic ? (
              <Badge variant="success">
                <LucideCheck className="icon" />
              </Badge>
            ) : (
              <Badge variant="danger">
                <LucideX className="icon" />
              </Badge>
            )
        },
        {
          id: "action",
          header: t("common:operation"),
          cell: ({ row }) => {
            return (
              <Button
                variant="link"
                size="small"
                onClick={() => {
                  onChangeModals({
                    type: RealModalEnum.DELETE_ADDRESS,
                    data: row.original
                  })
                }}
              >
                {t("common:delete")}
              </Button>
            )
          }
        }
      ]
    }
  })

  const modalProps = useCallback(
    (type: RealModalEnum) => ({
      onCloseModals: <T,>(data: T) => {
        if (data) {
          getUserQuery.refetch()
        }
        onCloseModals()
      },
      onChangeModals,
      modals,
      open: modals?.type === type
    }),
    [getUserQuery.data, modals]
  )

  return (
    <>
      <UserInfo
        modal={[modals, onChangeModals, onCloseModals]}
        user={user}
        loading={getUserQuery.isLoading}
      />
      <AddressModal {...modalProps(RealModalEnum.ADDRESS)} />
      <AddressDeleteModal {...modalProps(RealModalEnum.DELETE_ADDRESS)} />
      <Table {...addressTableProps} />
      {/* <Table {...roleTableProps} /> */}
      {/* <Table {...tableProps} /> */}
    </>
  )
}

export default UserPage
