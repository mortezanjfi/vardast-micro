"use client"

import { useMemo, useState } from "react"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import { Project, UserTypeProject } from "@vardast/graphql/generated"
import { getAllProjectsQueryFn } from "@vardast/query/queryFns/orders/getAllProjectsQueryFn"
import useTranslation from "next-translate/useTranslation"

import Table from "../table/Table"
import { ITableProps } from "../table/type"
import AddProjectModal from "./AddProjectModal"
import { ProjectsFilter, ProjectsFilterSchema } from "./ProjectsFilter"

type ProjectsPageProps = {
  isAdmin?: boolean
  title: string
  isMobileView: boolean
}

const ProjectsPage = ({ isMobileView, isAdmin }: ProjectsPageProps) => {
  const [addProjectOpen, setAddProjectOpen] = useState<boolean>(false)
  const { t } = useTranslation()

  const tableProps: ITableProps<Project, typeof ProjectsFilterSchema> = useMemo(
    () => ({
      name: "projects",
      onRow: {
        url: (row) => `/profile/projects/${row.original.id}`
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
        accessToken: true,
        api: getAllProjectsQueryFn
      },
      filters: {
        schema: ProjectsFilterSchema,
        Component: ProjectsFilter
      },
      columns: [
        {
          id: "row",
          header: t("common:row"),
          accessorFn: (_, index) => digitsEnToFa(index + 1)
        },
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
          accessorFn: ({ closedOrdersCount }) => digitsEnToFa(closedOrdersCount)
        },
        {
          id: "totalOrdersCount",
          header: t("common:total_orders"),
          accessorFn: ({ totalOrdersCount }) => digitsEnToFa(totalOrdersCount)
        }
      ]
    }),
    []
  )

  return (
    <div className="flex flex-col gap-7">
      <AddProjectModal
        isMobileView={isMobileView}
        isAdmin={isAdmin}
        open={addProjectOpen}
        setOpen={setAddProjectOpen}
      />
      <Table {...tableProps} />
    </div>
  )
}

export default ProjectsPage
