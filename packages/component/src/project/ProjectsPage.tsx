"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FolderOpenIcon } from "@heroicons/react/24/solid"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import {
  Project,
  TypeProject,
  useGetAllProjectsQuery,
  UserTypeProject
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import clsx from "clsx"
import useTranslation from "next-translate/useTranslation"

import CardContainer from "../desktop/CardContainer"
import Link from "../Link"
import Loading from "../Loading"
import PageHeader from "../PageHeader"
import Pagination from "../Pagination"
import AddProjectModal from "./AddProjectModal"
import PageTitle from "./PageTitle"
import ProjectCard from "./ProjectCard"
import ProjectDeleteModal from "./ProjectDeleteModal"

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

const ProjectsPage = ({ isAdmin, isMobileView, title }: ProjectsPageProps) => {
  const { t } = useTranslation()
  const [addProjectOpen, setAddProjectOpen] = useState<boolean>(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [projectToDelete, setProjectToDelete] = useState<{}>()
  const myProjectsQuery = useGetAllProjectsQuery(
    graphqlRequestClientWithToken,
    {
      indexProjectInput: {
        page: currentPage
      }
    },
    { queryKey: [{ page: currentPage }], refetchOnMount: "always" }
  )
  const adminAddNewProject = () => {
    setAddProjectOpen(true)
    // router.push(`/profile/projects/new`)
  }

  return (
    <>
      <AddProjectModal open={addProjectOpen} setOpen={setAddProjectOpen} />
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
            <Link
              className="btn-primary btn btn-md"
              href="/profile/projects/new"
            >
              {t("common:add_new_entity", {
                entity: t("common:project")
              })}
            </Link>
          </PageHeader>
        )}
        <div className={clsx("w-full", isMobileView && " h-full px-6")}>
          {myProjectsQuery.isFetching && myProjectsQuery.isLoading ? (
            <div className="flex h-full items-center justify-center pt-6">
              <Loading hideMessage />
            </div>
          ) : myProjectsQuery.data?.projects?.data?.length > 0 ? (
            isAdmin ? (
              <CardContainer
                button={{
                  text: "افزودن پروژه",
                  variant: "primary",
                  onClick: adminAddNewProject
                }}
                title="لیست‌ پروژه ها"
              >
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
                      <th className="border">{t("common:last-order-date")}</th>
                      <th className="border">{t("common:project-manager")}</th>
                      <th className="border">{t("common:created_at")}</th>

                      <th className="border">{t("common:last-updated-at")}</th>

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
                                (user) => user?.type === UserTypeProject.Manager
                              )?.user?.fullName || "--"}
                            </td>
                            {/* تاریخ ایجاد */}
                            <td className="border">
                              {digitsEnToFa(
                                new Date(project.createTime).toLocaleDateString(
                                  "fa-IR",
                                  {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit"
                                  }
                                )
                              )}
                            </td>
                            {/* آخرین بروز رسانی */}
                            <td className="border">--</td>
                            {/* وضعیت */}
                            <td className="border">--</td>
                            <td className="border">
                              <Link
                                target="_blank"
                                href={`/profile/projects/${project.id}`}
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
                <Pagination
                  total={myProjectsQuery.data.projects.lastPage ?? 0}
                  page={currentPage}
                  onChange={(page) => {
                    setCurrentPage(page)
                  }}
                />
              </CardContainer>
            ) : (
              <div className={clsx("flex h-full flex-col")}>
                <div className="flex flex-col">
                  {myProjectsQuery.data?.projects?.data?.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project as Project}
                      setProjectToDelete={setProjectToDelete}
                      setDeleteModalOpen={setDeleteModalOpen}
                    />
                  ))}
                </div>
                {isMobileView && (
                  <Link
                    className="btn-primary btn btn-md mt-auto py-3"
                    href="/profile/projects/new"
                  >
                    {t("common:add_new_entity", {
                      entity: t("common:project")
                    })}
                  </Link>
                )}
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center gap-5 py-7">
              <FolderOpenIcon
                width={isMobileView ? 48 : 64}
                height={isMobileView ? 48 : 64}
                className="text-alpha-400"
              />
              <p>شما هنوز پروژه ای اضافه نکرده اید!</p>
              {isMobileView && (
                <Link
                  className="btn-primary btn btn-md py-5"
                  href="/profile/projects/new"
                >
                  {t("common:add_new_entity", {
                    entity: t("common:project")
                  })}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ProjectsPage
