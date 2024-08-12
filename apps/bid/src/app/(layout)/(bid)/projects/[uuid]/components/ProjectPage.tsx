"use client"

import { useCallback, useMemo } from "react"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import DetailsCard from "@vardast/component/desktop/DetailsCard"
import { ITableProps, Table, useTable } from "@vardast/component/table"
import { DetailsCardPropsType } from "@vardast/component/types/type"
import {
  Address,
  useFindOneProjectQuery,
  UserProject
} from "@vardast/graphql/generated"
import { MultiStatusesFa } from "@vardast/lib/constants"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Button } from "@vardast/ui/button"
import { useModals } from "@vardast/ui/modal"
import useTranslation from "next-translate/useTranslation"

import ProjectAddressDeleteModal from "@/app/(layout)/(bid)/projects/[uuid]/components/address/ProjectAddressDeleteModal"
import ProjectAddressModal from "@/app/(layout)/(bid)/projects/[uuid]/components/address/ProjectAddressModal"
import ProjectInfoModal from "@/app/(layout)/(bid)/projects/[uuid]/components/ProjectInfoModal"
import ProjectUserDeleteModal from "@/app/(layout)/(bid)/projects/[uuid]/components/user/ProjectMemberDeleteModal"
import ProjectMemberModal from "@/app/(layout)/(bid)/projects/[uuid]/components/user/ProjectMemberModal"
import {
  IOrderPageProps,
  OrderModalEnum
} from "@/app/(layout)/(bid)/types/type"

const ProjectPage = ({ uuid }: IOrderPageProps) => {
  const { t } = useTranslation()
  const [modals, onChangeModals, onCloseModals] = useModals<OrderModalEnum>()

  const findOneProjectQuery = useFindOneProjectQuery(
    graphqlRequestClientWithToken,
    {
      id: +uuid
    }
  )

  const addressTableProps: ITableProps<Address> = useTable({
    model: {
      name: "project-address",
      container: {
        button: {
          onClick: () =>
            onChangeModals({
              type: OrderModalEnum.ADDRESS,
              data: findOneProjectQuery.data?.findOneProject
            }),
          text: t("common:add_new_entity", {
            entity: t("common:address")
          })
        },
        title: t(`common:addresses`)
      },
      fetch: {
        directData: {
          data: findOneProjectQuery.data?.findOneProject?.addresses.map(
            (item) => item.address as Address
          ),
          directLoading:
            findOneProjectQuery.isLoading || findOneProjectQuery.isFetching
        }
      },
      columns: [
        {
          id: "title",
          header: t("common:title"),
          accessorKey: "title"
        },
        {
          id: "address",
          header: t("common:address"),
          cell: ({ row }) => {
            return (
              <div className="whitespace-pre-wrap">
                {row?.original?.address}
              </div>
            )
          }
        },
        {
          header: t("common:postalCode"),
          accessorKey: "postalCode",
          accessorFn: ({ postalCode }) => digitsEnToFa(postalCode || "-")
        },
        {
          id: "province",
          header: t("common:province"),
          accessorFn: ({ province }) => province?.name
        },
        {
          id: "city",
          header: t("common:city"),
          accessorFn: ({ city }) => city?.name
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
                    type: OrderModalEnum.DELETE_ADDRESS,
                    data: {
                      ...row.original,
                      projectId: findOneProjectQuery.data?.findOneProject?.id
                    }
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

  const usersProjectTableProps: ITableProps<UserProject> = useTable({
    model: {
      name: "project-users",
      container: {
        button: {
          onClick: () =>
            onChangeModals({
              type: OrderModalEnum.USER,
              data: findOneProjectQuery.data?.findOneProject
            }),
          text: t("common:add_new_entity", {
            entity: t("common:colleague")
          })
        },
        title: t(`common:colleagues`)
      },
      fetch: {
        directData: {
          data: findOneProjectQuery.data?.findOneProject
            ?.users as UserProject[],
          directLoading:
            findOneProjectQuery.isLoading || findOneProjectQuery.isFetching
        }
      },
      columns: [
        {
          id: "fullName",
          header: t("common:name"),
          accessorFn: ({ user }) => digitsEnToFa(user?.fullName || "-")
        },
        {
          id: "cellphone",
          header: t("common:cellphone"),
          accessorFn: ({ user }) => digitsEnToFa(user?.cellphone || "-")
        },
        {
          id: "wallet",
          header: t("common:wallet"),
          accessorFn: ({ wallet }) => digitsEnToFa(wallet || "-")
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
                    type: OrderModalEnum.DELETE_USER,
                    data: {
                      ...row.original,
                      projectId: findOneProjectQuery.data?.findOneProject?.id
                    }
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
    (type: OrderModalEnum) => ({
      uuid,
      onCloseModals: <T,>(data: T) => {
        if (data) {
          findOneProjectQuery.refetch()
        }
        onCloseModals()
      },
      onChangeModals,
      modals,
      open: modals?.type === type
    }),
    [findOneProjectQuery.data, modals]
  )

  const detailsCardProps: DetailsCardPropsType = useMemo(
    () => ({
      badges: [
        {
          children: `${t("common:entity_code", { entity: t("common:project") })} ${digitsEnToFa(findOneProjectQuery.data?.findOneProject?.uuid || "-")}`
        },
        {
          children:
            MultiStatusesFa[findOneProjectQuery.data?.findOneProject?.status]
              ?.name_fa || "-",
          variant:
            MultiStatusesFa[findOneProjectQuery.data?.findOneProject?.status]
              ?.variant
        }
      ],
      items: [
        {
          item: {
            key: t("common:entity_name", { entity: t("common:project") }),
            value: findOneProjectQuery.data?.findOneProject?.name
          }
        },
        {
          item: {
            key: t("common:entity_name", { entity: t("common:company") }),
            value: findOneProjectQuery.data?.findOneProject?.legal?.name_company
          }
        },
        {
          item: {
            key: t("common:wallet"),
            value: findOneProjectQuery.data?.findOneProject?.wallet
              ? `${findOneProjectQuery.data?.findOneProject?.wallet} (${t("common:toman")})`
              : undefined
          }
        },
        {
          item: {
            key: t("common:orders_entity", { entity: t("common:open") }),
            value: digitsEnToFa(
              findOneProjectQuery.data?.findOneProject?.openOrdersCount || "-"
            )
          }
        },
        {
          item: {
            key: t("common:orders_entity", { entity: t("common:failed") }),
            value: digitsEnToFa(
              findOneProjectQuery.data?.findOneProject?.failedOrdersCount || "-"
            )
          }
        },
        {
          item: {
            key: t("common:orders_entity", { entity: t("common:closed") }),
            value: digitsEnToFa(
              findOneProjectQuery.data?.findOneProject?.closedOrdersCount || "-"
            )
          }
        },
        {
          item: {
            key: t("common:orders_entity", { entity: t("common:total") }),
            value: digitsEnToFa(
              findOneProjectQuery.data?.findOneProject?.totalOrdersCount || "-"
            )
          }
        },
        {
          item: {
            key: t("common:description"),
            value: findOneProjectQuery.data?.findOneProject?.description
          },
          className: "col-span-full"
        }
      ],
      card: {
        title: t("common:entity_info", { entity: t("common:project") }),
        button: {
          onClick: () =>
            onChangeModals({
              type: OrderModalEnum.INFO,
              data: findOneProjectQuery.data?.findOneProject
            }),
          disabled:
            findOneProjectQuery.isLoading || findOneProjectQuery.isFetching,
          text: t("common:edit_entity", {
            entity: t("common:entity_info", { entity: t("common:company") })
          }),
          type: "button"
        }
      }
    }),
    [findOneProjectQuery, findOneProjectQuery.data]
  )

  return (
    <>
      <ProjectInfoModal {...modalProps(OrderModalEnum.INFO)} />
      <ProjectAddressModal {...modalProps(OrderModalEnum.ADDRESS)} />
      <ProjectAddressDeleteModal
        {...modalProps(OrderModalEnum.DELETE_ADDRESS)}
      />
      <ProjectMemberModal {...modalProps(OrderModalEnum.USER)} />
      <ProjectUserDeleteModal {...modalProps(OrderModalEnum.DELETE_USER)} />
      <DetailsCard {...detailsCardProps} />
      <Table {...addressTableProps} />
      <Table {...usersProjectTableProps} />
    </>
  )
}

export default ProjectPage
