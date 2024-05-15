"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@vardast/ui/tabs"
import useTranslation from "next-translate/useTranslation"

import PageTitle from "@/app/(client)/(profile)/components/PageTitle"
import ProjectAddressesTab from "@/app/(client)/(profile)/profile/projects/components/ProjectAddressesTab"
import ProjectColleaguesTab from "@/app/(client)/(profile)/profile/projects/components/ProjectColleaguesTab"
import ProjectInfoTab from "@/app/(client)/(profile)/profile/projects/components/ProjectInfoTab"

type ProjectFormProps = { uuid?: string; title: string }

const ProjectForm = ({ title }: ProjectFormProps) => {
  const { t } = useTranslation()

  const [activeTab, setActiveTab] = useState("projectInfo")

  return (
    <div className="flex h-full w-full flex-col gap-9">
      <PageTitle title={title} />
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex h-full w-full flex-col"
      >
        <TabsList className="w-full border-b">
          <TabsTrigger value="projectInfo">{t("common:project")}</TabsTrigger>
          <TabsTrigger value="addresses">{t("common:addresses")}</TabsTrigger>
          <TabsTrigger value="colleagues">
            {t("common:project-colleagues")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="projectInfo">
          <ProjectInfoTab setActiveTab={setActiveTab} />
        </TabsContent>
        <TabsContent value="addresses">
          <ProjectAddressesTab
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </TabsContent>
        <TabsContent value="colleagues">
          <ProjectColleaguesTab
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ProjectForm
