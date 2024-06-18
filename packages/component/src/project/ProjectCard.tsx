"use client"

import { useState } from "react"
import { Project } from "@vardast/graphql/generated"
import { Button } from "@vardast/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@vardast/ui/dropdown-menu"
import { LucideMoreVertical } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

import { DetailsWithTitle } from "../desktop/DetailsWithTitle"
import Link from "../Link"

type ProjectCardProps = {
  project: Project
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const { t } = useTranslation()
  const [dropDownMenuOpen, setDropDownMenuOpen] = useState(false)

  return (
    <div className="flex w-full  items-start justify-between border-b  border-alpha-200 py-4">
      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full items-center justify-between">
          <span className="text-base font-semibold">{project.name}</span>
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
              <Link href={`/profile/projects/${project.id}`}>
                <DropdownMenuItem>
                  <span>{t("common:edit")}</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem>
                <Link href={`/profile/projects/${project.id}`}>
                  <span>{t("common:details")}</span>
                </Link>
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex flex-col items-start gap">
          {/* <DetailsWithTitle
            title="آدرس ها"
            text={project?.address
              .map((address) => `- ${address.address.address}`)
              .join("\n")}
          /> */}
          <DetailsWithTitle
            title="همکاران پروژه"
            className="!flex-col"
            text={project?.user
              .map((user) => `- ${user.user.fullName}`)
              .join("\n")}
          />
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
