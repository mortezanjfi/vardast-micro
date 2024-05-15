"use client"

import { Dispatch, SetStateAction, useState } from "react"
import Link from "@vardast/component/Link"
import { Button } from "@vardast/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@vardast/ui/dropdown-menu"
import { LucideEdit, LucideMoreVertical, LucideTrash } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

import { DetailsWithTitle } from "@/app/(client)/(profile)/profile/projects/components/DetailsWithTitle"

type ProjectCardProps = {
  project: any
  setProjectToDelete: Dispatch<SetStateAction<{} | undefined>>
  setDeleteModalOpen: Dispatch<SetStateAction<boolean>>
}

const ProjectCard = ({
  project,
  setProjectToDelete,
  setDeleteModalOpen
}: ProjectCardProps) => {
  const { t } = useTranslation()

  const [dropDownMenuOpen, setDropDownMenuOpen] = useState(false)

  return (
    <div className="flex w-full  items-start justify-between border-b  border-alpha-200 py-4">
      {" "}
      <div className="flex flex-col gap-4 py-7">
        <span className="text-base font-semibold">{project.name}</span>
        <div className="flex items-center gap-5">
          <DetailsWithTitle title={"تحویل گیرنده"} text={project.transferee} />
          <DetailsWithTitle
            title={"شماره تماس تحویل گیرنده"}
            text={project.transfereeNum}
          />
          <DetailsWithTitle title="آدرس" text={project.address} />
        </div>
      </div>
      <DropdownMenu
        modal={false}
        open={dropDownMenuOpen}
        onOpenChange={setDropDownMenuOpen}
      >
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" iconOnly>
            <LucideMoreVertical className="icon text-black" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <Link
            href={`
      /profile/projects/${project.id}
    `}
          >
            <DropdownMenuItem>
              <LucideEdit className="dropdown-menu-item-icon" />
              <span>{t("common:edit")}</span>
            </DropdownMenuItem>
          </Link>
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                setProjectToDelete(project)
                setDeleteModalOpen(true)
              }}
              className="danger"
            >
              <LucideTrash className="dropdown-menu-item-icon" />
              <span>{t("common:delete")}</span>
            </DropdownMenuItem>
          </>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default ProjectCard
