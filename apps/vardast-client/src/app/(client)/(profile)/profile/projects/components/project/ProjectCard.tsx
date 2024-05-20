"use client"

import { Dispatch, SetStateAction, useState } from "react"
import Link from "@vardast/component/Link"
import { Project } from "@vardast/graphql/generated"
import { Button } from "@vardast/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@vardast/ui/dropdown-menu"
import { LucideEdit, LucideMoreVertical } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

import { DetailsWithTitle } from "@/app/(client)/(profile)/profile/projects/components/DetailsWithTitle"

type ProjectCardProps = {
  project: Project
  setProjectToDelete: Dispatch<SetStateAction<{} | undefined>>
  setDeleteModalOpen: Dispatch<SetStateAction<boolean>>
}

const ProjectCard = ({
  project
  // setProjectToDelete,
  // setDeleteModalOpen
}: ProjectCardProps) => {
  const { t } = useTranslation()

  const [dropDownMenuOpen, setDropDownMenuOpen] = useState(false)

  return (
    <div className="flex w-full  items-start justify-between border-b  border-alpha-200 py-4">
      <div className="flex flex-col gap-4 py-7">
        <span className="text-base font-semibold">{project.name}</span>
        <div className="flex flex-col items-start gap">
          <DetailsWithTitle
            title="همکاران پروژه"
            text={project?.user
              .map((user) => `- ${user.user.fullName}`)
              .join("\n")}
          />
          <DetailsWithTitle
            title="آدرس ها"
            text={project?.address
              .map((address) => `- ${address.address.address}`)
              .join("\n")}
          />
        </div>
      </div>
      <DropdownMenu open={dropDownMenuOpen} onOpenChange={setDropDownMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" iconOnly>
            <LucideMoreVertical className="icon text-black" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <Link href={`/profile/projects/${project.id}`}>
            <DropdownMenuItem>
              <LucideEdit className="dropdown-menu-item-icon" />
              <span>{t("common:edit")}</span>
            </DropdownMenuItem>
          </Link>
          <>
            {/* <DropdownMenuSeparator /> */}
            {/* <DropdownMenuItem
              onSelect={() => {
                setProjectToDelete(project)
                setDeleteModalOpen(true)
              }}
              className="danger"
              >
              <LucideTrash className="dropdown-menu-item-icon" />
              <span>{t("common:delete")}</span>
            </DropdownMenuItem> */}
          </>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default ProjectCard
