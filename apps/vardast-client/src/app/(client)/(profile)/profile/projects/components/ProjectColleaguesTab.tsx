"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { UserIcon } from "@heroicons/react/24/solid"
import PageHeader from "@vardast/component/PageHeader"
import { Button } from "@vardast/ui/button"
import useTranslation from "next-translate/useTranslation"

import ColleagueDeleteModal from "@/app/(client)/(profile)/profile/projects/components/ColleagueDeleteModal"
import { ColleagueModal } from "@/app/(client)/(profile)/profile/projects/components/ColleagueModal"
import ProjectColleagueCart from "@/app/(client)/(profile)/profile/projects/components/ProjectColleagueCart"

type ProjectColleaguesTabProps = {
  activeTab: string
  setActiveTab: Dispatch<SetStateAction<string>>
}

export interface Colleague {
  id: number
  name: string
  familyName: string
  cellPhone: number
}

const ProjectColleaguesTab = ({ activeTab }: ProjectColleaguesTabProps) => {
  const { t } = useTranslation()
  const [colleagueModalOpen, setColleagueModalOpen] = useState<boolean>(false)

  const [colleagues, setColleagues] = useState<Colleague[]>([])
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [colleagueToDelete, setColleagueToDelete] = useState<Colleague>()

  const submit = () => {
    console.log(colleagues)
  }

  return (
    <div className="flex h-full w-full flex-col">
      <ColleagueDeleteModal
        colleagueToDelete={colleagueToDelete}
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
      />
      <ColleagueModal
        setColleagues={setColleagues}
        activeTab={activeTab}
        open={colleagueModalOpen}
        onOpenChange={setColleagueModalOpen}
      />
      {colleagues.length > 0 && (
        <PageHeader
          pageHeaderClasses="!mb-0 py-5 border-b"
          title={"همکاران پروژه را تعریف و مدیریت کنید."}
          titleClasses="text-[14px] font-normal "
          containerClass="items-center"
        >
          {" "}
          <Button
            variant="outline-primary"
            size="medium"
            onClick={() => {
              setColleagueModalOpen(true)
            }}
          >
            {t("common:add_new_entity", {
              entity: t("common:user")
            })}
          </Button>
        </PageHeader>
      )}

      <div className="flex w-full flex-col">
        {colleagues.length ? (
          colleagues.map((coll) => (
            <ProjectColleagueCart
              setColleagueToDelete={setColleagueToDelete}
              key={coll.id}
              colleague={coll}
              setDeleteModalOpen={setDeleteModalOpen}
              setColleagueModalOpen={setColleagueModalOpen}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center gap-5 py-7">
            <UserIcon width={64} height={64} className="text-alpha-400" />
            <p>شما هنوز کاربری اضافه نکرده اید!</p>
            <Button
              className="my-5"
              size="medium"
              onClick={() => {
                setColleagueModalOpen(true)
              }}
            >
              {t("common:add_new_entity", {
                entity: t("common:user")
              })}
            </Button>
          </div>
        )}
        <div className="flex flex-row-reverse  border-alpha-200 pt-9">
          <Button type="button" variant="primary" onClick={submit}>
            تایید و ادامه
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProjectColleaguesTab
