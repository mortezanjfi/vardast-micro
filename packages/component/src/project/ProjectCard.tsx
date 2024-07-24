"use client"

import { useState } from "react"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import { Project, UserTypeProject } from "@vardast/graphql/generated"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import { Button } from "@vardast/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@vardast/ui/dropdown-menu"
import { LucideMoreVertical } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

import { DetailsWithTitle } from "../desktop/DetailsWithTitle"
import DynamicHeroIcon from "../DynamicHeroIcon"
import Link from "../Link"

type ProjectCardProps = {
  project: Project
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const { t } = useTranslation()
  const [dropDownMenuOpen, setDropDownMenuOpen] = useState(false)

  return (
    <div className="flex w-full flex-col gap-4  py-6">
      <div className="flex w-full items-center justify-between">
        <div className="flex gap-3 md:gap-9">
          <DynamicHeroIcon
            icon="FolderOpenIcon"
            className={mergeClasses(
              "icon h-7 w-7 flex-shrink-0 transform rounded-md bg-blue-500 p-1 text-alpha-white transition-all"
            )}
            solid={false}
          />
          <span className="whitespace-pre-wrap">{project?.name}</span>
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
            <Link href={`/profile/projects/${project.id}`}>
              <DropdownMenuItem>
                <span>{t("common:edit")}</span>
              </DropdownMenuItem>
            </Link>
            {/* <DropdownMenuSeparator /> */}
            {/* <DropdownMenuItem>
                <Link href={`/profile/projects/${project.id}`}>
                  <span>{t("common:details")}</span>
                </Link>
              </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-col items-start gap-1 md:flex-row md:gap-9">
        <DetailsWithTitle
          dot={false}
          icon="UserIcon"
          title="مدیر پروژه"
          text={
            project?.user.find((user) => user.type === UserTypeProject.Manager)
              .name
          }
        />
        <DetailsWithTitle
          dot={false}
          icon="MapPinIcon"
          title="آدرس"
          text={project?.address[0]?.address?.city?.name}
        />
      </div>
      {Number(project?.totalOrdersCount) !== 0 && (
        <div className="flex flex-col rounded-2xl bg-alpha-50 p-4">
          <div className="flex w-full justify-between border-b-0.5 border-alpha-300 pb-3">
            <span>سفارشات</span>
            <div className="flex gap-1 text-sm text-alpha-500">
              <span>{digitsEnToFa(project?.totalOrdersCount)}</span>
              <span>سفارش</span>
            </div>
          </div>
          <div className="flex flex-col pt-3">
            {project?.openOrdersCount &&
              Number(project?.openOrdersCount) !== 0 && (
                <DetailsWithTitle
                  dotColor="bg-blue-600"
                  title="جاری"
                  text={project?.openOrdersCount}
                />
              )}
            {/* تحویل شده -------------->*/}
            {/* {project?.closedOrdersCount &&
              Number(project?.closedOrdersCount) !== 0 && (
                <DetailsWithTitle
                  dotColor="bg-success-500"
                  title="تحویل شده"
                  text={project?.openOrdersCount}
                />
              )} */}
            {project?.closedOrdersCount &&
              Number(project?.closedOrdersCount) !== 0 && (
                <DetailsWithTitle
                  dotColor="bg-error-500"
                  title="بسته شده"
                  text={project?.closedOrdersCount}
                />
              )}
            {project?.failedOrdersCount &&
              Number(project?.failedOrdersCount) !== 0 && (
                <DetailsWithTitle
                  dotColor="bg-alpha-500"
                  title="لغو شده"
                  text={project?.failedOrdersCount}
                />
              )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectCard
