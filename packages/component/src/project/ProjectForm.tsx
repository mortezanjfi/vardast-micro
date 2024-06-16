"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { UseQueryResult } from "@tanstack/react-query"
import {
  FindOneProjectQuery,
  useFindOneProjectQuery
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@vardast/ui/tabs"
import useTranslation from "next-translate/useTranslation"

import PageTitle from "./PageTitle"
import ProjectAddressesTab from "./ProjectAddressesTab"
import ProjectUsersTab from "./user/ProjectUsersTab"

export enum PROJECT_TAB {
  // INFO = "info",
  ADDRESSES = "addresses",
  PROJECT_USERS = "project-colleagues"
}

export type ProjectFormProps = {
  isMobileView: boolean
  uuid?: string
  title: string
  isNew: boolean
}

export type ProjectTabProps = Pick<ProjectFormProps, "uuid" | "isNew"> & {
  setActiveTab: Dispatch<SetStateAction<PROJECT_TAB>>
  activeTab: PROJECT_TAB
  findOneProjectQuery: UseQueryResult<FindOneProjectQuery, unknown>
  isMobileView?: boolean
}

const ProjectForm = ({
  isMobileView,
  title,
  isNew,
  uuid
}: ProjectFormProps) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<PROJECT_TAB>(PROJECT_TAB.ADDRESSES)

  const findOneProjectQuery = useFindOneProjectQuery(
    graphqlRequestClientWithToken,
    {
      id: +uuid
    },
    { enabled: !isNew }
  )

  const tabProps = {
    isMobileView,
    uuid,
    isNew,
    activeTab,
    setActiveTab,
    findOneProjectQuery
  }

  return (
    <div className="flex h-full w-full flex-col gap-9 py-6 md:py-0">
      {!isMobileView && (
        <PageTitle backButtonUrl="/profile/projects" title={title} />
      )}
      <Tabs
        value={activeTab}
        onValueChange={(e) => setActiveTab(e as PROJECT_TAB)}
        className="flex h-full w-full flex-col"
      >
        <TabsList className="grid w-full grid-cols-3 border-b md:flex">
          <TabsTrigger value={PROJECT_TAB.ADDRESSES}>اطلاعات پروژه</TabsTrigger>
          <TabsTrigger
            disabled={!findOneProjectQuery.data}
            value={PROJECT_TAB.ADDRESSES}
          >
            {t(`common:${PROJECT_TAB.ADDRESSES}`)}
          </TabsTrigger>
          <TabsTrigger
            disabled={!findOneProjectQuery.data}
            value={PROJECT_TAB.PROJECT_USERS}
          >
            {t(`common:${PROJECT_TAB.PROJECT_USERS}`)}
          </TabsTrigger>
        </TabsList>
        {/* <TabsContent className="!h-full" value={PROJECT_TAB.INFO}>
          <ProjectInfoTab {...tabProps} />
        </TabsContent> */}
        <TabsContent className="!h-full" value={PROJECT_TAB.ADDRESSES}>
          <ProjectAddressesTab {...tabProps} />
        </TabsContent>
        <TabsContent className="!h-full" value={PROJECT_TAB.PROJECT_USERS}>
          <ProjectUsersTab {...tabProps} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ProjectForm
