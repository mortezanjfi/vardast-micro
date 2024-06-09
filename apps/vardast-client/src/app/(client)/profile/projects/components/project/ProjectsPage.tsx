"use client"

import { useState } from "react"
import { FolderOpenIcon } from "@heroicons/react/24/solid"
import Link from "@vardast/component/Link"
import Loading from "@vardast/component/Loading"
import PageHeader from "@vardast/component/PageHeader"
import { Project, useMyProjectsQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import clsx from "clsx"
import useTranslation from "next-translate/useTranslation"

import PageTitle from "@/app/(client)/profile/components/PageTitle"
import ProjectCard from "@/app/(client)/profile/projects/components/project/ProjectCard"
import ProjectDeleteModal from "@/app/(client)/profile/projects/components/project/ProjectDeleteModal"

type ProjectsPageProps = { title: string; isMobileView: boolean }
// const statuses = [
//   {
//     status: "دارد",
//     value: "true"
//   },
//   { status: "ندارد", value: "false" },
//   {
//     status: "همه",
//     value: ""
//   }
// ]

const ProjectsPage = ({ isMobileView, title }: ProjectsPageProps) => {
  const { t } = useTranslation()
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [projectToDelete, setProjectToDelete] = useState<{}>()
  const myProjectsQuery = useMyProjectsQuery(
    graphqlRequestClientWithToken,
    undefined,
    {
      refetchOnMount: "always"
    }
  )

  return (
    <div className="flex h-full w-full flex-col ">
      <ProjectDeleteModal
        projectToDelete={projectToDelete}
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
      />
      {!isMobileView && <PageTitle title={title} />}
      {/* <div className="flex w-full gap-5 border-b border-alpha-200 pb-5">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              noStyle
              role="combobox"
              className="flex items-center gap-3 rounded-full border border-alpha-200 bg-alpha-white px-5 py-2 text-start"
            >
              <span className="text-alpha-500">پروژه</span>
              همه
              <LucideChevronDown className="ms-auto h-4 w-4 shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Command>
              <CommandEmpty>
                {t("common:no_entity_found", {
                  entity: t("common:producer")
                })}
              </CommandEmpty>
              <CommandGroup>
                {statuses.map((st) => (
                  <CommandItem
                    value={st.value}
                    key={st.status}
                    onSelect={(value) => {
                      form.setValue("logoStatus", value)
                    }}
                  >
                    <LucideCheck
                      className={mergeClasses(
                        "mr-2 h-4 w-4",
                        st.value === field.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {st.status}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>{" "}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              noStyle
              role="combobox"
              className="flex items-center gap-3 rounded-full border border-alpha-200 bg-alpha-white px-5 py-2 text-start"
            >
              {" "}
              <span className="text-alpha-500">وضعیت</span>
              همه
              <LucideChevronDown className="ms-auto h-4 w-4 shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Command>
              <CommandEmpty>
                {t("common:no_entity_found", {
                  entity: t("common:producer")
                })}
              </CommandEmpty>
              <CommandGroup>
                {statuses.map((st) => (
                  <CommandItem
                    value={st.value}
                    key={st.status}
                    onSelect={(value) => {
                      form.setValue("logoStatus", value)
                    }}
                  >
                    <LucideCheck
                      className={mergeClasses(
                        "mr-2 h-4 w-4",
                        st.value === field.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {st.status}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>{" "}
      </div> */}
      {!isMobileView && (
        <PageHeader
          pageHeaderClasses="border-b py-5 !mb-0"
          title={
            "پروژه های خود را تعریف کنید و مدیریت خرید کالای آن را راحت تر انجام دهید"
          }
          titleClasses="text-[14px] font-normal "
          containerClass="items-center"
        >
          <Link className="btn-primary btn btn-md" href="/profile/projects/new">
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
        ) : myProjectsQuery.data?.myProjects?.length > 0 ? (
          <div className={clsx("flex h-full flex-col")}>
            <div className="flex flex-col">
              {myProjectsQuery.data?.myProjects?.map((project) => (
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
  )
}

export default ProjectsPage
