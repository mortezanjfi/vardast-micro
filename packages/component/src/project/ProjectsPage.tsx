"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { FolderOpenIcon } from "@heroicons/react/24/solid"
import { zodResolver } from "@hookform/resolvers/zod"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import {
  MultiStatuses,
  Project,
  TypeProject,
  useFindOneProjectQuery,
  useGetAllProjectsQuery,
  UserTypeProject
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import clsx from "clsx"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import { ApiCallStatusEnum } from "../../../type/src/Enums"
import { Button } from "../../../ui/src/button"
import { getContentByApiStatus } from "../../../util/src/GetContentByApiStatus"
import CardContainer from "../desktop/CardContainer"
import Link from "../Link"
import Loading from "../Loading"
import LoadingFailed from "../LoadingFailed"
import NoResult from "../NoResult"
import PageHeader from "../PageHeader"
import Pagination from "../Pagination"
import AddProjectModal from "./AddProjectModal"
import PageTitle from "./PageTitle"
import ProjectCard from "./ProjectCard"
import ProjectDeleteModal from "./ProjectDeleteModal"
import { ProjectsFilter } from "./ProjectsFilter"

type ProjectsPageProps = {
  isAdmin?: boolean
  title: string
  isMobileView: boolean
}

export const TypeProjectFa = {
  [TypeProject.Legal]: {
    name_fa: "حقوقی"
  },
  [TypeProject.Real]: {
    name_fa: "حقیقی"
  }
}

export const statusProjectFa = {
  [MultiStatuses.Confirmed]: {
    name_fa: "تایید شدده"
  },
  [MultiStatuses.Pending]: {
    name_fa: "در انتظار تایید"
  },
  [MultiStatuses.Rejected]: {
    name_fa: "رد شده"
  }
}
export const ProjectsFilterSchema = z.object({
  name: z.string().optional(),
  nameManager: z.string().optional(),

  nameEmployer: z.string().optional(),
  status: z.string().optional()
})

export type ProjectsFilterType = TypeOf<typeof ProjectsFilterSchema>

const renderedListStatus = {
  [ApiCallStatusEnum.LOADING]: <Loading />,
  [ApiCallStatusEnum.ERROR]: <LoadingFailed />,
  [ApiCallStatusEnum.EMPTY]: <NoResult entity="project" />,
  [ApiCallStatusEnum.DEFAULT]: null
}

const ProjectsPage = ({ isAdmin, isMobileView, title }: ProjectsPageProps) => {
  const { t } = useTranslation()
  const [addProjectOpen, setAddProjectOpen] = useState<boolean>(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [projectToDelete, setProjectToDelete] = useState<{}>()
  const [idToEdit, setIdToEdit] = useState<number | undefined>(undefined)

  const [ordersQueryParams, setOrdersQueryParas] = useState<ProjectsFilterType>(
    {}
  )
  const form = useForm<ProjectsFilterType>({
    resolver: zodResolver(ProjectsFilterSchema)
  })

  const myProjectsQuery = useGetAllProjectsQuery(
    graphqlRequestClientWithToken,
    {
      indexProjectInput: {
        page: currentPage,
        nameOrUuid: ordersQueryParams.name,
        nameEmployer: ordersQueryParams.nameEmployer,
        nameManager: ordersQueryParams.nameManager,
        status: ordersQueryParams.status as MultiStatuses
      }
    },
    {
      queryKey: [
        {
          page: currentPage,
          nameOrUuid: ordersQueryParams.name,
          nameEmployer: ordersQueryParams.nameEmployer,
          nameManager: ordersQueryParams.nameManager,
          status: ordersQueryParams.status as MultiStatuses
        }
      ],
      refetchOnMount: "always"
    }
  )
  const addNewProject = () => {
    setAddProjectOpen(true)
  }
  const findOneProjectQuery = useFindOneProjectQuery(
    graphqlRequestClientWithToken,
    {
      id: +idToEdit
    },
    { enabled: +idToEdit > 0 }
  )

  const projectLength = useMemo(
    () => myProjectsQuery?.data?.projects?.data?.length,
    [myProjectsQuery?.data?.projects?.data?.length]
  )

  return (
    <div className="flex flex-col gap-7">
      {isAdmin && (
        <ProjectsFilter
          setOrdersQueryParams={setOrdersQueryParas}
          form={form}
        />
      )}
      <AddProjectModal
        setIdToEdit={setIdToEdit}
        isMobileView={isMobileView}
        findOneProjectQuery={findOneProjectQuery}
        isAdmin={isAdmin}
        id={idToEdit}
        open={addProjectOpen}
        setOpen={setAddProjectOpen}
      />
      <div className="flex h-full w-full flex-col ">
        <ProjectDeleteModal
          projectToDelete={projectToDelete}
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
        />
        {!isMobileView && !isAdmin && <PageTitle title={title} />}

        {!isMobileView && !isAdmin && (
          <PageHeader
            pageHeaderClasses="border-b py-5 !mb-0"
            title={
              "پروژه های خود را تعریف کنید و مدیریت خرید کالای آن را راحت تر انجام دهید"
            }
            titleClasses="text-[14px] font-normal "
            containerClass="items-center"
          >
            <Button
              variant="primary"
              size="medium"
              className="py-3"
              onClick={addNewProject}
            >
              {t("common:add_new_entity", {
                entity: t("common:project")
              })}
            </Button>
          </PageHeader>
        )}
        <div className={clsx("w-full", isMobileView && " h-full px-6")}>
          {isAdmin ? (
            <CardContainer
              button={{
                text: "افزودن پروژه",
                variant: "primary",
                onClick: addNewProject
              }}
              title="لیست‌ پروژه ها"
            >
              {renderedListStatus[
                getContentByApiStatus(myProjectsQuery, !!projectLength)
              ] || (
                <>
                  <table className="table-hover table">
                    <thead>
                      <tr>
                        <th className="border">{t("common:row")}</th>
                        <th className="border">
                          {t("common:entity_uuid", {
                            entity: t("common:project")
                          })}
                        </th>
                        <th className="border">
                          {t("common:entity_name", {
                            entity: t("common:project")
                          })}
                        </th>
                        {/* <th className="border">
                {t("common:entity_count", { entity: t("common:order") })}
              </th> */}
                        <th className="border">
                          {t("common:entity_type", {
                            entity: t("common:project")
                          })}
                        </th>
                        <th className="border">
                          {t("common:last-order-date")}
                        </th>
                        <th className="border">
                          {t("common:project-manager")}
                        </th>
                        <th className="border">{t("common:created_at")}</th>

                        <th className="border">
                          {t("common:last-updated-at")}
                        </th>

                        <th className="border">{t("common:status")}</th>
                        <th className="border">{t("common:operation")}</th>
                      </tr>
                    </thead>

                    <tbody className="border-collapse border">
                      {myProjectsQuery.data?.projects?.data?.map(
                        (project, index) =>
                          project && (
                            <tr key={project.id}>
                              <td className="w-4 border">
                                <span>{digitsEnToFa(index + 1)}</span>
                              </td>
                              {/* شناسه پروژه */}
                              <td className="border">{project?.uuid}</td>
                              <td className="border">{project.name}</td>
                              {/* تعداد سفارش */}
                              {/* <td className="border">--</td> */}
                              {/* تاریخ آخرین سفارش */}

                              <td className="border">
                                {TypeProjectFa[project.type]?.name_fa}
                              </td>
                              <td className="border">--</td>
                              <td className="border">
                                {project.user.find(
                                  (user) =>
                                    user?.type === UserTypeProject.Manager
                                )?.user?.fullName || "--"}
                              </td>
                              {/* تاریخ ایجاد */}
                              <td className="border">
                                {digitsEnToFa(
                                  new Date(
                                    project.createTime
                                  ).toLocaleDateString("fa-IR", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit"
                                  })
                                )}
                              </td>
                              {/* آخرین بروز رسانی */}
                              <td className="border">--</td>
                              {/* وضعیت */}
                              <td className="border">
                                {statusProjectFa[project?.status].name_fa}
                              </td>
                              <td className="border">
                                <Link href={`/profile/projects/${project.id}`}>
                                  <span className="tag cursor-pointer text-blue-500">
                                    {t("common:details")}
                                  </span>
                                </Link>
                              </td>
                            </tr>
                          )
                      )}
                    </tbody>
                  </table>
                  <Pagination
                    total={myProjectsQuery.data.projects.lastPage ?? 0}
                    page={currentPage}
                    onChange={(page) => {
                      setCurrentPage(page)
                    }}
                  />
                </>
              )}
            </CardContainer>
          ) : myProjectsQuery.isFetching && myProjectsQuery.isLoading ? (
            <div className="flex h-full items-center justify-center pt-6">
              <Loading hideMessage />
            </div>
          ) : myProjectsQuery.data?.projects?.data?.length > 0 ? (
            <div className={clsx("flex h-full flex-col")}>
              <div className="flex flex-col">
                {myProjectsQuery.data?.projects?.data?.map((project) => (
                  <ProjectCard
                    addNewProject={addNewProject}
                    setIdToEdit={setIdToEdit}
                    key={project.id}
                    project={project as Project}
                  />
                ))}
              </div>
              {isMobileView && (
                <Button
                  variant="primary"
                  size="medium"
                  className="py-3"
                  onClick={addNewProject}
                >
                  {t("common:add_new_entity", {
                    entity: t("common:project")
                  })}
                </Button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-5 py-7">
              <FolderOpenIcon
                width={isMobileView ? 48 : 64}
                height={isMobileView ? 48 : 64}
                className="text-alpha-400"
              />
              <p>شما هنوز پروژه ای اضافه نکرده اید!</p>
              {isMobileView && (
                <Button
                  variant="primary"
                  size="medium"
                  className="py-3"
                  onClick={addNewProject}
                >
                  {t("common:add_new_entity", {
                    entity: t("common:project")
                  })}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectsPage
