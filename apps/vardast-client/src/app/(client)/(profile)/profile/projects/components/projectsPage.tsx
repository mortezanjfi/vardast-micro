"use client"

import { useState } from "react"
import { FolderOpenIcon } from "@heroicons/react/24/solid"
import PageHeader from "@vardast/component/PageHeader"
import { Button } from "@vardast/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from "@vardast/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@vardast/ui/popover"
import { LucideChevronDown } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

import PageTitle from "@/app/(client)/(profile)/components/PageTitle"
import ProjectCard from "@/app/(client)/(profile)/profile/projects/components/ProjectCard"
import ProjectDeleteModal from "@/app/(client)/(profile)/profile/projects/components/ProjectDeleteModal"

type ProjectsPageProps = { title: string }
const statuses = [
  {
    status: "دارد",
    value: "true"
  },
  { status: "ندارد", value: "false" },
  {
    status: "همه",
    value: ""
  }
]

const ProjectsPage = ({ title }: ProjectsPageProps) => {
  const { t } = useTranslation()
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [projectToDelete, setProjectToDelete] = useState<{}>()

  // eslint-disable-next-line no-unused-vars
  const [projects, setProjects] = useState([
    {
      id: 1234,
      name: "test",
      transferee: "test person",
      address: "test address",
      transfereeNum: "09121111111"
    },
    {
      id: 4321,
      name: "test",
      transferee: "test person",
      address: "test address",
      transfereeNum: "09121111111"
    }
  ])

  return (
    <div className="flex h-full w-full flex-col ">
      <ProjectDeleteModal
        projectToDelete={projectToDelete}
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
      />
      <PageTitle title={title} />
      <div className="flex w-full gap-5 border-b border-alpha-200 pb-5">
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
                    // onSelect={(value) => {
                    //   form.setValue("logoStatus", value)
                    // }}
                  >
                    {/* <LucideCheck
                      className={mergeClasses(
                        "mr-2 h-4 w-4",
                        st.value === field.value ? "opacity-100" : "opacity-0"
                      )}
                    /> */}
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
                    // onSelect={(value) => {
                    //   form.setValue("logoStatus", value)
                    // }}
                  >
                    {/* <LucideCheck
                      className={mergeClasses(
                        "mr-2 h-4 w-4",
                        st.value === field.value ? "opacity-100" : "opacity-0"
                      )}
                    /> */}
                    {st.status}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>{" "}
      </div>
      <PageHeader
        pageHeaderClasses="border-b py-5 !mb-0"
        title={
          "پروژه های خود را تعریف کنید و مدیریت خرید کالای آن را راحت تر انجام دهید"
        }
        titleClasses="text-[14px] font-normal "
        containerClass="items-center"
      >
        {" "}
        <Button variant="primary" size="medium">
          {t("common:add_new_entity", {
            entity: t("common:address")
          })}
        </Button>
      </PageHeader>
      <div className="w-full">
        {projects.length > 0 ? (
          <div className="flex flex-col">
            {projects.map((project, index) => (
              <ProjectCard
                key={index}
                project={project}
                setProjectToDelete={setProjectToDelete}
                setDeleteModalOpen={setDeleteModalOpen}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-5 py-7">
            <FolderOpenIcon width={64} height={64} className="text-alpha-400" />
            <p>شما هنوز پروژه ای اضافه نکرده اید!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectsPage
