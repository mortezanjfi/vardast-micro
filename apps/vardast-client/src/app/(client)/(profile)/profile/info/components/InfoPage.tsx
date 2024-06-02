"use client"

import { useSession } from "next-auth/react"

import PageTitle from "@/app/(client)/(profile)/components/PageTitle"
import UpdateInfoItem from "@/app/(client)/(profile)/profile/info/components/UpdateInfoItem"

type InfoPageProps = {
  isMobileView: boolean
  title: string
}

const InfoPage = ({ isMobileView, title }: InfoPageProps) => {
  const { data: session } = useSession()

  return (
    <div className="flex h-full w-full flex-col gap-9">
      {!isMobileView && <PageTitle title={title} />}
      <div className=" w-full gap-x  border-alpha-200 bg-alpha-white text-alpha-500 md:grid md:grid-cols-2 md:grid-rows-2">
        <UpdateInfoItem
          title="نام"
          name="firstName"
          value={session?.profile?.firstName || ""}
        />
        <UpdateInfoItem
          title="نام خانوادگی"
          name="lastName"
          value={session?.profile?.lastName || ""}
        />
      </div>
    </div>
  )
}

export default InfoPage
