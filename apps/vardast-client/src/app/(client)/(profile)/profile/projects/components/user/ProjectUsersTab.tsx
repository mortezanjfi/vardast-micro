"use client"

import { useState } from "react"
import { UserIcon } from "@heroicons/react/24/solid"
import Loading from "@vardast/component/Loading"
import PageHeader from "@vardast/component/PageHeader"
import { User } from "@vardast/graphql/generated"
import { Button } from "@vardast/ui/button"
import useTranslation from "next-translate/useTranslation"

import { ProjectTabProps } from "@/app/(client)/(profile)/profile/projects/components/project/ProjectForm"
import ProjectUserCart from "@/app/(client)/(profile)/profile/projects/components/user/ProjectUserCart"
import UserDeleteModal from "@/app/(client)/(profile)/profile/projects/components/user/UserDeleteModal"
import { UserModal } from "@/app/(client)/(profile)/profile/projects/components/user/UserModal"

export type ProjectUser = User

export enum SELECTED_ITEM_TYPE {
  DELETE = "DELETE",
  ADD = "ADD",
  EDIT = "EDIT"
}

export type SELECTED_ITEM = {
  type: SELECTED_ITEM_TYPE
  data?: ProjectUser
}

export type ProjectUserCartProps = {
  isMobileView?: boolean
  uuid: string
  selectedUsers: SELECTED_ITEM
  onCloseModal: (_?: any) => void
}

const ProjectUsersTab = ({
  isMobileView,
  uuid,
  findOneProjectQuery
}: ProjectTabProps) => {
  const { t } = useTranslation()
  const [selectedUsers, setSelectedUsers] = useState<SELECTED_ITEM>()

  const onCloseModal = () => {
    setSelectedUsers(undefined)
  }

  const onOpenModal = (selectedUsers: SELECTED_ITEM) => {
    setSelectedUsers(selectedUsers)
  }

  return (
    <div className="flex h-full w-full flex-col">
      <UserDeleteModal
        uuid={uuid}
        onCloseModal={onCloseModal}
        selectedUsers={selectedUsers}
      />
      <UserModal
        isMobileView={isMobileView}
        uuid={uuid}
        onCloseModal={onCloseModal}
        selectedUsers={selectedUsers}
      />

      {findOneProjectQuery?.data?.findOneProject?.user.length > 0 && (
        <PageHeader
          pageHeaderClasses="!mb-0 py-5 border-b"
          title={"همکاران پروژه را تعریف و مدیریت کنید."}
          titleClasses="text-[14px] font-normal "
          containerClass={isMobileView && "!flex-col !items-start"}
        >
          <Button
            className="py-2"
            variant="outline-primary"
            size="medium"
            onClick={() => {
              onOpenModal({
                type: SELECTED_ITEM_TYPE.ADD,
                data: undefined
              })
            }}
          >
            {t("common:add_new_entity", {
              entity: t("common:user")
            })}
          </Button>
        </PageHeader>
      )}

      {findOneProjectQuery.isFetching && findOneProjectQuery.isLoading ? (
        <div className="flex h-full items-center justify-center pt-6">
          <Loading hideMessage />
        </div>
      ) : findOneProjectQuery?.data?.findOneProject?.user.length > 0 ? (
        findOneProjectQuery?.data?.findOneProject?.user.map((user) => (
          <ProjectUserCart
            key={user.id}
            user={user.user as ProjectUser}
            onOpenModal={onOpenModal}
          />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center gap-5 py-7">
          <UserIcon
            width={isMobileView ? 48 : 64}
            height={isMobileView ? 48 : 64}
            className="text-alpha-400"
          />
          <p>شما هنوز همکار اضافه نکرده اید!</p>{" "}
          <Button
            className="my-5 py-3"
            size="medium"
            onClick={() => {
              onOpenModal({
                type: SELECTED_ITEM_TYPE.ADD,
                data: undefined
              })
            }}
          >
            {t("common:add_new_entity", {
              entity: t("common:user")
            })}
          </Button>
        </div>
      )}

      {isMobileView && (
        <div className="absolute bottom-[calc(env(safe-area-inset-bottom)*0.5+8rem)] flex w-full justify-end md:relative md:bottom-0">
          <Button
            className="w-full md:w-fit"
            disabled={
              findOneProjectQuery?.data?.findOneProject?.address.length === 0
            }
            loading={
              findOneProjectQuery.isFetching && findOneProjectQuery.isLoading
            }
            type="submit"
            variant="primary"
          >
            ذخیره اطلاعات
          </Button>
        </div>
      )}
    </div>
  )
}

export default ProjectUsersTab
