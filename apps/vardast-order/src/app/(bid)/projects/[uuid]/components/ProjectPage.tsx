"use client"

import { useMemo } from "react"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import { useModals } from "@vardast/component/modal"
import Table from "@vardast/component/table/Table"
import { ITableProps } from "@vardast/component/table/type"
import useTable from "@vardast/component/table/useTable"
import {
  ProjectAddress,
  useFindOneProjectQuery,
  User
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Button } from "@vardast/ui/button"
import useTranslation from "next-translate/useTranslation"

import { IOrderPageProps, OrderModalEnum } from "@/types/type"
import DetailsCard from "@/app/(bid)/orders/components/DetailsCard"
import AddressDeleteModal from "@/app/(bid)/projects/[uuid]/components/address/AddressDeleteModal"
import { AddressModal } from "@/app/(bid)/projects/[uuid]/components/address/AddressModal"
import { InfoNameType } from "@/app/(bid)/projects/[uuid]/components/InfoModal"
import UserDeleteModal from "@/app/(bid)/projects/[uuid]/components/user/UserDeleteModal"
import { UserModal } from "@/app/(bid)/projects/[uuid]/components/user/UserModal"

import InfoModal from "./InfoModal"

const ProjectPage = ({ uuid }: IOrderPageProps) => {
  const { t } = useTranslation()
  const [modals, onChangeModals, onCloseModals] = useModals<OrderModalEnum>()

  const findOneProjectQuery = useFindOneProjectQuery(
    graphqlRequestClientWithToken,
    {
      id: +uuid
    }
  )

  const addressTableProps: ITableProps<ProjectAddress> = useTable({
    model: {
      name: "project-address",
      container: {
        button: {
          onClick: () =>
            onChangeModals({
              type: OrderModalEnum.ADDRESS
            }),
          text: t("common:add_new_entity", {
            entity: t("common:address")
          })
        },
        title: t(`common:addresses`)
      },
      onRow: {
        onClick: (row) =>
          onChangeModals({
            type: OrderModalEnum.ADDRESS,
            data: row.original
          })
      },
      fetch: {
        directData: {
          data: findOneProjectQuery.data?.findOneProject?.address.map(
            (item) => ({ ...item.address }) as ProjectAddress
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
          header: t("common:transferee"),
          accessorKey: "delivery_name"
        },
        {
          header: t("common:transferee-number"),
          accessorKey: "delivery_contact"
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
                  onChangeModals<ProjectAddress>({
                    type: OrderModalEnum.DELETE_ADDRESS,
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

  const usersTableProps: ITableProps<User> = useTable({
    model: {
      name: "project-users",
      container: {
        button: {
          onClick: () =>
            onChangeModals({
              type: OrderModalEnum.USER
            }),
          text: t("common:add_new_entity", {
            entity: t("common:colleague")
          })
        },
        title: t(`common:colleagues`)
      },
      fetch: {
        directData: {
          data: findOneProjectQuery.data?.findOneProject?.user.map((item) => ({
            ...item.user
          })),
          directLoading:
            findOneProjectQuery.isLoading || findOneProjectQuery.isFetching
        }
      },
      columns: [
        {
          id: "fullName",
          header: t("common:name"),
          accessorFn: ({ fullName }) => digitsEnToFa(fullName || "-")
        },
        {
          id: "delivery_name",
          header: t("common:cellphone"),
          accessorFn: ({ cellphone }) => digitsEnToFa(cellphone || "-")
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
                  onChangeModals<User>({
                    type: OrderModalEnum.DELETE_USER,
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

  const items = useMemo(() => {
    return [
      {
        item: {
          key: t("common:entity_name", { entity: t("common:project") }),
          value: findOneProjectQuery.data?.findOneProject?.name
        }
      }
    ]
  }, [findOneProjectQuery.data])

  const sectionProps = {
    uuid,
    onCloseModals,
    modals
  }

  return (
    <>
      <AddressDeleteModal
        open={modals?.type === OrderModalEnum.DELETE_ADDRESS}
        {...sectionProps}
      />
      <AddressModal
        open={modals?.type === OrderModalEnum.ADDRESS}
        {...sectionProps}
      />
      <UserDeleteModal
        open={modals?.type === OrderModalEnum.DELETE_USER}
        {...sectionProps}
      />
      <UserModal
        open={modals?.type === OrderModalEnum.USER}
        {...sectionProps}
      />
      <InfoModal
        open={modals?.type === OrderModalEnum.INFO}
        {...sectionProps}
      />
      <DetailsCard
        items={items}
        card={{
          title: t("common:project-info"),
          button: {
            onClick: () =>
              onChangeModals<InfoNameType>({
                type: OrderModalEnum.INFO,
                data: { name: findOneProjectQuery.data?.findOneProject?.name }
              }),
            text: t("common:edit"),
            type: "button"
          }
        }}
      />
      <Table {...addressTableProps} />
      <Table {...usersTableProps} />
    </>
  )
}

export default ProjectPage
