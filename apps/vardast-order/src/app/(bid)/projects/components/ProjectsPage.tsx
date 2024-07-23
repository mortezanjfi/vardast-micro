"use client"

import { useState } from "react"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import Link from "@vardast/component/Link"
import Table from "@vardast/component/table/Table"
import {
  FilterComponentTypeEnum,
  ITableProps
} from "@vardast/component/table/type"
import useTable from "@vardast/component/table/useTable"
import { Project, UserTypeProject } from "@vardast/graphql/generated"
import { getAllProjectsQueryFn } from "@vardast/query/queryFns/orders/getAllProjectsQueryFn"
import useTranslation from "next-translate/useTranslation"
import { z } from "zod"

import AddProjectModal from "./AddProjectModal"

type ProjectsPageProps = {
  isMobileView: boolean
}

const ProjectsFilterSchema = z.object({
  nameEmployer: z.string().nullish(),
  nameManager: z.string().nullish(),
  nameOrUuid: z.string().nullish()
})

const ProjectsPage = ({ isMobileView }: ProjectsPageProps) => {
  const [addProjectOpen, setAddProjectOpen] = useState<boolean>(false)
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
            text: "افزودن پروژه",
            variant: "primary",
            onClick: () => setAddProjectOpen(true)
          },
          title: "لیست‌ پروژه ها"
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
            accessorFn: ({ user }) =>
              user?.find((item) => item?.type === UserTypeProject.Manager)?.user
                ?.fullName || "--"
          },
          {
            id: "openOrdersCount",
            header: t("common:open_orders"),
            accessorFn: ({ openOrdersCount }) => digitsEnToFa(openOrdersCount)
          },
          {
            id: "closedOrdersCount",
            header: t("common:closed_orders"),
            accessorFn: ({ closedOrdersCount }) =>
              digitsEnToFa(closedOrdersCount)
          },
          {
            id: "totalOrdersCount",
            header: t("common:total_orders"),
            accessorFn: ({ totalOrdersCount }) => digitsEnToFa(totalOrdersCount)
          },
          {
            id: "action",
            header: t("common:total_orders"),
            cell: ({ row }) => (
              <Link
                href={`${process.env.NEXT_PUBLIC_BIDDING_PATH}orders/?args={"projectId":"${row.original.id}"}`}
              >
                سفارشات
              </Link>
            )
          }
        ]
      }
    })

  return (
    <>
      <AddProjectModal
        isMobileView={isMobileView}
        open={addProjectOpen}
        setOpen={setAddProjectOpen}
      />
      <Table {...tableProps} />
    </>
  )
}

export default ProjectsPage
