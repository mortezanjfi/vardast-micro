"use client"

import { useCallback } from "react"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import Link from "@vardast/component/Link"
import {
  FilterComponentTypeEnum,
  ITableProps,
  Table,
  useTable
} from "@vardast/component/table"
import { Project, UserTypeProject } from "@vardast/graphql/generated"
import { getAllProjectsQueryFn } from "@vardast/query/queryFns/orders/getAllProjectsQueryFn"
import { useModals } from "@vardast/ui/modal"
import useTranslation from "next-translate/useTranslation"
import { z } from "zod"

import ProjectModal from "@/app/(layout)/(bid)/projects/[uuid]/components/ProjectModal"
import { OrderModalEnum } from "@/app/(layout)/(bid)/types/type"

type ProjectsPageProps = {}

const ProjectsFilterSchema = z.object({
  nameEmployer: z.string().nullish(),
  nameManager: z.string().nullish(),
  nameOrUuid: z.string().nullish()
})

const ProjectsPage = (_: ProjectsPageProps) => {
  const [modals, onChangeModals, onCloseModals] = useModals<OrderModalEnum>()
  const { t } = useTranslation()

  const tableProps: ITableProps<Project, typeof ProjectsFilterSchema> =
    useTable({
      model: {
        name: "projects",
        onRow: {
          url: (row) =>
            `${process.env.NEXT_PUBLIC_BIDDING_PATH}projects/${row.original.id}`
        },
        container: {
          button: {
            text: t("common:add_entity", { entity: t("common:project") }),
            variant: "primary",
            onClick: () =>
              onChangeModals({
                type: OrderModalEnum.ADD_PROJECT
              })
          },
          title: t("common:entity_list", { entity: t("common:projects") })
        },
        paginable: true,
        fetch: {
          api: getAllProjectsQueryFn
        },
        filters: {
          schema: ProjectsFilterSchema,
          options: [
            {
              type: FilterComponentTypeEnum.INPUT,
              name: "nameOrUuid",
              title: t("common:entity_name", { entity: t("common:project") })
            },
            {
              type: FilterComponentTypeEnum.INPUT,
              name: "nameManager",
              title: t("common:project-manager")
            },
            {
              type: FilterComponentTypeEnum.INPUT,
              name: "nameEmployer",
              title: t("common:entity_name", { entity: t("common:users") })
            }
          ]
        },
        columns: [
          {
            header: t("common:entity_name", { entity: t("common:project") }),
            accessorKey: "name"
          },
          {
            id: "user",
            header: t("common:project-manager"),
            accessorFn: ({ users }) =>
              users?.find((item) => item?.type === UserTypeProject.Manager)
                ?.user?.fullName || "--"
          },
          {
            id: "orders",
            header: () => (
              <div className="text-center">{t("common:orders")}</div>
            ),
            columns: [
              {
                id: "openOrdersCount",
                header: t("common:open"),
                accessorFn: ({ openOrdersCount }) =>
                  digitsEnToFa(openOrdersCount)
              },
              {
                id: "failedOrdersCount",
                header: t("common:failed"),
                accessorFn: ({ failedOrdersCount }) =>
                  digitsEnToFa(failedOrdersCount)
              },
              {
                id: "closedOrdersCount",
                header: t("common:closed"),
                accessorFn: ({ closedOrdersCount }) =>
                  digitsEnToFa(closedOrdersCount)
              },
              {
                id: "totalOrdersCount",
                header: t("common:total"),
                accessorFn: ({ totalOrdersCount }) =>
                  digitsEnToFa(totalOrdersCount)
              }
            ]
          },
          {
            id: "action",
            header: t("common:operation"),
            cell: ({ row }) => (
              <Link
                className="btn btn-small btn-link"
                href={`${process.env.NEXT_PUBLIC_BIDDING_PATH}orders/?args={"projectId":"${row.original.id}"}`}
              >
                {t("common:orders")}
              </Link>
            )
          }
        ]
      }
    })

  const modalProps = useCallback(
    (type: OrderModalEnum) => ({
      onCloseModals,
      onChangeModals,
      modals,
      open: modals?.type === type
    }),
    [modals]
  )

  return (
    <>
      <ProjectModal {...modalProps(OrderModalEnum.ADD_PROJECT)} />
      <Table {...tableProps} />
    </>
  )
}

export default ProjectsPage
